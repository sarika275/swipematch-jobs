import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SwipeJob {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  salary_range: string | null;
  skills_required: string[] | null;
  recruiter_id: string;
  created_at: string;
  compatibility?: number;
}

export interface SwipeCandidate {
  id: string;
  user_id: string;
  name: string;
  bio: string | null;
  skills: string[] | null;
  experience_years: number | null;
  location: string | null;
  summary?: string;
  compatibility?: number;
}

const BATCH_SIZE = 10;

export const useSwipeCards = () => {
  const { user, role } = useAuth();
  const [jobs, setJobs] = useState<SwipeJob[]>([]);
  const [candidates, setCandidates] = useState<SwipeCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [swipedIds, setSwipedIds] = useState<string[]>([]);
  const [undoStack, setUndoStack] = useState<{ id: string; dir: "left" | "right" }[]>([]);

  const fetchCards = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Get already swiped IDs
    const { data: existingSwipes } = await supabase
      .from("swipes")
      .select("target_id")
      .eq("swiper_id", user.id);

    const alreadySwiped = existingSwipes?.map((s) => s.target_id) ?? [];
    setSwipedIds(alreadySwiped);

    if (role === "candidate") {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(BATCH_SIZE);

      const filtered = (data ?? []).filter((j) => !alreadySwiped.includes(j.id));
      setJobs(filtered);
    } else {
      const { data } = await supabase
        .from("candidate_profiles")
        .select("*")
        .limit(BATCH_SIZE);

      const filtered = (data ?? []).filter((c) => !alreadySwiped.includes(c.id));
      setCandidates(filtered);
    }
    setLoading(false);
  }, [user, role]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  const recordSwipe = useCallback(
    async (targetId: string, direction: "left" | "right") => {
      if (!user || !role) return;

      const targetType = role === "candidate" ? "job" : "candidate";

      await supabase.from("swipes").insert({
        swiper_id: user.id,
        target_id: targetId,
        target_type: targetType as "job" | "candidate",
        direction,
      });

      setUndoStack((prev) => [...prev, { id: targetId, dir: direction }]);

      // Check for match if swiped right
      if (direction === "right") {
        await checkForMatch(targetId, targetType);
      }
    },
    [user, role]
  );

  const checkForMatch = async (targetId: string, targetType: string) => {
    if (!user) return;

    if (targetType === "job") {
      // Candidate swiped right on job — check if recruiter swiped right on this candidate
      const { data: job } = await supabase
        .from("jobs")
        .select("recruiter_id")
        .eq("id", targetId)
        .single();

      if (!job) return;

      const { data: recruiterSwipe } = await supabase
        .from("swipes")
        .select("id")
        .eq("swiper_id", job.recruiter_id)
        .eq("target_id", user.id)
        .eq("direction", "right")
        .maybeSingle();

      if (recruiterSwipe) {
        await createMatch(user.id, job.recruiter_id, targetId);
      }
    } else {
      // Recruiter swiped right on candidate — check if candidate swiped right on any of recruiter's jobs
      const { data: myJobs } = await supabase
        .from("jobs")
        .select("id")
        .eq("recruiter_id", user.id);

      if (!myJobs?.length) return;

      for (const job of myJobs) {
        const { data: candidateSwipe } = await supabase
          .from("swipes")
          .select("id")
          .eq("swiper_id", targetId)
          .eq("target_id", job.id)
          .eq("direction", "right")
          .maybeSingle();

        if (candidateSwipe) {
          // Get candidate's user_id
          const { data: candidateProfile } = await supabase
            .from("candidate_profiles")
            .select("user_id")
            .eq("id", targetId)
            .single();

          if (candidateProfile) {
            await createMatch(candidateProfile.user_id, user.id, job.id);
          }
          break;
        }
      }
    }
  };

  const createMatch = async (candidateId: string, recruiterId: string, jobId: string) => {
    // Check if match already exists
    const { data: existing } = await supabase
      .from("matches")
      .select("id")
      .eq("candidate_id", candidateId)
      .eq("recruiter_id", recruiterId)
      .eq("job_id", jobId)
      .maybeSingle();

    if (existing) return;

    await supabase.from("matches").insert({
      candidate_id: candidateId,
      recruiter_id: recruiterId,
      job_id: jobId,
    });

    // Create notification for both parties
    const { data: job } = await supabase
      .from("jobs")
      .select("title")
      .eq("id", jobId)
      .single();

    const title = job?.title ?? "a position";

    // Notification for candidate
    await supabase.from("notifications").insert({
      user_id: candidateId,
      type: "match",
      title: "New Match! 🎉",
      body: `You matched on "${title}"`,
      data: { job_id: jobId },
    });

    // Notification for recruiter
    await supabase.from("notifications").insert({
      user_id: recruiterId,
      type: "match",
      title: "New Match! 🎉",
      body: `A candidate matched on "${title}"`,
      data: { job_id: jobId },
    });
  };

  const undo = useCallback(async () => {
    if (!user || undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];

    await supabase
      .from("swipes")
      .delete()
      .eq("swiper_id", user.id)
      .eq("target_id", last.id);

    setUndoStack((prev) => prev.slice(0, -1));

    // Re-add the card
    if (role === "candidate") {
      const { data } = await supabase.from("jobs").select("*").eq("id", last.id).single();
      if (data) setJobs((prev) => [data, ...prev]);
    } else {
      const { data } = await supabase.from("candidate_profiles").select("*").eq("id", last.id).single();
      if (data) setCandidates((prev) => [data, ...prev]);
    }
  }, [user, role, undoStack]);

  const cards = role === "candidate" ? jobs : [];
  const candidateCards = role === "recruiter" ? candidates : [];

  return {
    jobs,
    candidates,
    loading,
    recordSwipe,
    undo,
    canUndo: undoStack.length > 0,
    refreshCards: fetchCards,
    setJobs,
    setCandidates,
  };
};
