import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { MapPin, DollarSign, Clock, X, Heart, Star, Building2, Undo2, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSwipeCards, SwipeJob, SwipeCandidate } from "@/hooks/useSwipeCards";
import { Navigate } from "react-router-dom";

const SWIPE_THRESHOLD = 100;

const GRADIENT_COLORS = [
  "from-[hsl(12,90%,58%)] to-[hsl(33,100%,55%)]",
  "from-[hsl(250,80%,60%)] to-[hsl(280,90%,65%)]",
  "from-[hsl(180,60%,45%)] to-[hsl(200,80%,50%)]",
  "from-[hsl(45,100%,50%)] to-[hsl(30,100%,55%)]",
  "from-[hsl(340,80%,55%)] to-[hsl(10,90%,60%)]",
];

const getGradient = (index: number) => GRADIENT_COLORS[index % GRADIENT_COLORS.length];

// --- Job Card ---
const JobSwipeCard = ({
  job,
  index,
  onSwipe,
  isTop,
}: {
  job: SwipeJob;
  index: number;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > SWIPE_THRESHOLD) onSwipe("right");
      else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("left");
    },
    [onSwipe]
  );

  if (!isTop) {
    return (
      <motion.div className="absolute inset-0 rounded-3xl bg-card border shadow-card" style={{ scale: 0.95, y: 10 }}>
        <div className={`h-44 rounded-t-3xl bg-gradient-to-br ${getGradient(index)}`} />
      </motion.div>
    );
  }

  const color = getGradient(index);

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      exit={{ x: x.get() > 0 ? 400 : -400, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="w-full h-full rounded-3xl bg-card border shadow-elevated overflow-hidden flex flex-col">
        <div className={`h-44 bg-gradient-to-br ${color} relative shrink-0`}>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm rounded-t-3xl"
          >
            <span className="text-5xl font-extrabold text-green-500 border-4 border-green-500 rounded-xl px-6 py-2 rotate-[-15deg]">LIKE</span>
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm rounded-t-3xl"
          >
            <span className="text-5xl font-extrabold text-red-500 border-4 border-red-500 rounded-xl px-6 py-2 rotate-[15deg]">NOPE</span>
          </motion.div>
          <div className="absolute bottom-4 left-5">
            <div className="w-12 h-12 rounded-xl bg-card/20 backdrop-blur flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          {job.compatibility !== undefined && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full bg-card/20 backdrop-blur text-primary-foreground text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {job.compatibility}% match
              </span>
            </div>
          )}
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-card/20 backdrop-blur text-primary-foreground text-xs font-medium">
              {new Date(job.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <h2 className="text-2xl font-extrabold text-card-foreground mb-1">{job.title}</h2>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{job.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {(job.skills_required ?? []).slice(0, 5).map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{tag}</span>
            ))}
          </div>
          <div className="mt-auto space-y-2 text-sm">
            {job.location && (
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {job.location}</div>
            )}
            {job.salary_range && (
              <div className="flex items-center gap-2 text-muted-foreground"><DollarSign className="w-4 h-4" /> {job.salary_range}</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Candidate Card ---
const CandidateSwipeCard = ({
  candidate,
  index,
  onSwipe,
  isTop,
}: {
  candidate: SwipeCandidate;
  index: number;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > SWIPE_THRESHOLD) onSwipe("right");
      else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("left");
    },
    [onSwipe]
  );

  if (!isTop) {
    return (
      <motion.div className="absolute inset-0 rounded-3xl bg-card border shadow-card" style={{ scale: 0.95, y: 10 }}>
        <div className={`h-44 rounded-t-3xl bg-gradient-to-br ${getGradient(index)}`} />
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      exit={{ x: x.get() > 0 ? 400 : -400, opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="w-full h-full rounded-3xl bg-card border shadow-elevated overflow-hidden flex flex-col">
        <div className={`h-44 bg-gradient-to-br ${getGradient(index)} relative shrink-0`}>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm rounded-t-3xl"
          >
            <span className="text-5xl font-extrabold text-green-500 border-4 border-green-500 rounded-xl px-6 py-2 rotate-[-15deg]">LIKE</span>
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm rounded-t-3xl"
          >
            <span className="text-5xl font-extrabold text-red-500 border-4 border-red-500 rounded-xl px-6 py-2 rotate-[15deg]">NOPE</span>
          </motion.div>
          <div className="absolute bottom-4 left-5">
            <div className="w-12 h-12 rounded-xl bg-card/20 backdrop-blur flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          {candidate.compatibility !== undefined && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1.5 rounded-full bg-card/20 backdrop-blur text-primary-foreground text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {candidate.compatibility}% match
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <h2 className="text-2xl font-extrabold text-card-foreground mb-1">{candidate.name}</h2>
          <p className="text-sm text-muted-foreground mb-2">
            {candidate.experience_years ? `${candidate.experience_years} years experience` : ""}
          </p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">{candidate.bio}</p>
          {candidate.summary && (
            <p className="text-xs text-primary bg-primary/5 rounded-lg p-3 mb-4 italic">{candidate.summary}</p>
          )}
          <div className="flex flex-wrap gap-2 mb-4">
            {(candidate.skills ?? []).slice(0, 5).map((skill) => (
              <span key={skill} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{skill}</span>
            ))}
          </div>
          <div className="mt-auto text-sm">
            {candidate.location && (
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" /> {candidate.location}</div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Swipe = () => {
  const { user, role, loading: authLoading } = useAuth();
  const { jobs, candidates, loading, recordSwipe, undo, canUndo, setJobs, setCandidates } = useSwipeCards();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const items = role === "candidate" ? jobs : candidates;
  const visibleItems = items.slice(currentIndex, currentIndex + 2);
  const allSwiped = currentIndex >= items.length;

  const handleSwipe = async (dir: "left" | "right") => {
    const item = items[currentIndex];
    if (!item) return;
    const targetId = "user_id" in item ? item.id : item.id;
    await recordSwipe(targetId, dir);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleUndo = async () => {
    if (currentIndex > 0) {
      await undo();
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-foreground">
            {role === "candidate" ? "Discover Jobs" : "Discover Candidates"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {role === "candidate" ? "Swipe right on roles you love" : "Swipe right on talent you want"}
          </p>
        </div>

        <div className="relative h-[520px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-pulse text-muted-foreground">Loading cards...</div>
            </div>
          ) : allSwiped ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6">
                <Star className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">All caught up!</h2>
              <p className="text-muted-foreground mb-6">Check back later for new {role === "candidate" ? "opportunities" : "candidates"}</p>
              <Button onClick={() => setCurrentIndex(0)} className="gradient-primary text-primary-foreground border-0 rounded-xl">
                Start Over
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {visibleItems
                .slice()
                .reverse()
                .map((item, i) => {
                  const isTop = i === visibleItems.length - 1;
                  const globalIndex = currentIndex + (visibleItems.length - 1 - i);
                  if (role === "candidate") {
                    return (
                      <JobSwipeCard
                        key={(item as SwipeJob).id}
                        job={item as SwipeJob}
                        index={globalIndex}
                        onSwipe={handleSwipe}
                        isTop={isTop}
                      />
                    );
                  }
                  return (
                    <CandidateSwipeCard
                      key={(item as SwipeCandidate).id}
                      candidate={item as SwipeCandidate}
                      index={globalIndex}
                      onSwipe={handleSwipe}
                      isTop={isTop}
                    />
                  );
                })}
            </AnimatePresence>
          )}
        </div>

        {!allSwiped && !loading && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => handleSwipe("left")}
              className="w-16 h-16 rounded-full border-2 border-destructive/30 flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
            {canUndo && (
              <button
                onClick={handleUndo}
                className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                <Undo2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => handleSwipe("right")}
              className="w-20 h-20 rounded-full gradient-primary shadow-card flex items-center justify-center text-primary-foreground hover:scale-105 transition-transform"
            >
              <Heart className="w-9 h-9" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Swipe;
