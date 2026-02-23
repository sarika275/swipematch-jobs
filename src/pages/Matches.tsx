import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Building2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Match {
  id: string;
  candidate_id: string;
  recruiter_id: string;
  job_id: string;
  created_at: string;
  job_title?: string;
  other_name?: string;
}

const Matches = () => {
  const { user, role, loading: authLoading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchMatches = async () => {
      const { data } = await supabase
        .from("matches")
        .select("*")
        .order("created_at", { ascending: false });

      if (!data) { setLoading(false); return; }

      // Enrich with job title and other party name
      const enriched = await Promise.all(
        data.map(async (match) => {
          const { data: job } = await supabase
            .from("jobs")
            .select("title")
            .eq("id", match.job_id)
            .single();

          const otherId = role === "candidate" ? match.recruiter_id : match.candidate_id;
          let otherName = "Unknown";

          if (role === "candidate") {
            const { data: company } = await supabase
              .from("company_profiles")
              .select("company_name")
              .eq("user_id", otherId)
              .maybeSingle();
            if (company) otherName = company.company_name;
          } else {
            const { data: candidate } = await supabase
              .from("candidate_profiles")
              .select("name")
              .eq("user_id", otherId)
              .maybeSingle();
            if (candidate) otherName = candidate.name;
          }

          return {
            ...match,
            job_title: job?.title ?? "Unknown Position",
            other_name: otherName,
          };
        })
      );

      setMatches(enriched);
      setLoading(false);
    };

    fetchMatches();
  }, [user, role]);

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const GRADIENT_COLORS = [
    "from-[hsl(12,90%,58%)] to-[hsl(33,100%,55%)]",
    "from-[hsl(250,80%,60%)] to-[hsl(280,90%,65%)]",
    "from-[hsl(180,60%,45%)] to-[hsl(200,80%,50%)]",
  ];

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">Matches</h1>
        <p className="text-sm text-muted-foreground mb-8">
          {loading ? "Loading..." : `You have ${matches.length} match${matches.length !== 1 ? "es" : ""}`}
        </p>

        {!loading && matches.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No matches yet. Keep swiping!</p>
            <Link to="/swipe">
              <Button className="gradient-primary text-primary-foreground border-0 rounded-xl">
                Browse {role === "candidate" ? "Jobs" : "Candidates"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border shadow-card p-4 flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${GRADIENT_COLORS[i % 3]} flex items-center justify-center shrink-0`}>
                  {role === "candidate" ? (
                    <Building2 className="w-7 h-7 text-primary-foreground" />
                  ) : (
                    <User className="w-7 h-7 text-primary-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-card-foreground truncate">{match.job_title}</h3>
                  <p className="text-sm text-muted-foreground">{match.other_name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(match.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Link to={`/chat/${match.id}`}>
                  <Button size="sm" className="gradient-primary text-primary-foreground border-0 rounded-xl shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
