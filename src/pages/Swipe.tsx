import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { MapPin, DollarSign, Clock, X, Heart, Star, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  tags: string[];
  color: string;
  posted: string;
  description: string;
}

const JOBS: Job[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "TechFlow",
    location: "San Francisco, CA",
    salary: "$150k - $200k",
    type: "Full-time",
    tags: ["React", "TypeScript", "Tailwind"],
    color: "from-[hsl(12,90%,58%)] to-[hsl(33,100%,55%)]",
    posted: "2d ago",
    description: "Build next-gen interfaces for our AI-powered platform.",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "DesignLab",
    location: "Remote",
    salary: "$120k - $160k",
    type: "Full-time",
    tags: ["Figma", "Design Systems", "Prototyping"],
    color: "from-[hsl(250,80%,60%)] to-[hsl(280,90%,65%)]",
    posted: "5h ago",
    description: "Shape the user experience for millions of creators worldwide.",
  },
  {
    id: 3,
    title: "Backend Engineer",
    company: "DataStream",
    location: "New York, NY",
    salary: "$140k - $180k",
    type: "Full-time",
    tags: ["Node.js", "PostgreSQL", "AWS"],
    color: "from-[hsl(180,60%,45%)] to-[hsl(200,80%,50%)]",
    posted: "1d ago",
    description: "Scale our real-time data processing infrastructure.",
  },
  {
    id: 4,
    title: "Growth Marketing Lead",
    company: "RocketShip",
    location: "Austin, TX",
    salary: "$110k - $145k",
    type: "Full-time",
    tags: ["SEO", "Analytics", "Content"],
    color: "from-[hsl(45,100%,50%)] to-[hsl(30,100%,55%)]",
    posted: "3d ago",
    description: "Drive user acquisition and retention for our B2B SaaS product.",
  },
  {
    id: 5,
    title: "Mobile Developer",
    company: "AppWorks",
    location: "Remote",
    salary: "$130k - $170k",
    type: "Contract",
    tags: ["React Native", "iOS", "Android"],
    color: "from-[hsl(340,80%,55%)] to-[hsl(10,90%,60%)]",
    posted: "8h ago",
    description: "Build cross-platform mobile experiences used by millions.",
  },
];

const SWIPE_THRESHOLD = 100;

const SwipeCard = ({
  job,
  onSwipe,
  isTop,
}: {
  job: Job;
  onSwipe: (dir: "left" | "right") => void;
  isTop: boolean;
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0]);

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > SWIPE_THRESHOLD) {
        onSwipe("right");
      } else if (info.offset.x < -SWIPE_THRESHOLD) {
        onSwipe("left");
      }
    },
    [onSwipe]
  );

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0 rounded-3xl bg-card border shadow-card"
        style={{ scale: 0.95, y: 10 }}
      >
        <div className={`h-44 rounded-t-3xl bg-gradient-to-br ${job.color}`} />
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
        {/* Header gradient */}
        <div className={`h-44 bg-gradient-to-br ${job.color} relative shrink-0`}>
          {/* Like / Nope overlays */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute inset-0 flex items-center justify-center bg-green-500/20 backdrop-blur-sm rounded-t-3xl"
          >
            <span className="text-5xl font-extrabold text-green-500 border-4 border-green-500 rounded-xl px-6 py-2 rotate-[-15deg]">
              LIKE
            </span>
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute inset-0 flex items-center justify-center bg-red-500/20 backdrop-blur-sm rounded-t-3xl"
          >
            <span className="text-5xl font-extrabold text-red-500 border-4 border-red-500 rounded-xl px-6 py-2 rotate-[15deg]">
              NOPE
            </span>
          </motion.div>
          <div className="absolute bottom-4 left-5">
            <div className="w-12 h-12 rounded-xl bg-card/20 backdrop-blur flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <span className="px-3 py-1 rounded-full bg-card/20 backdrop-blur text-primary-foreground text-xs font-medium">
              {job.posted}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <h2 className="text-2xl font-extrabold text-card-foreground mb-1">{job.title}</h2>
          <p className="text-muted-foreground font-medium mb-3">{job.company}</p>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{job.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto space-y-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" /> {job.location}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-4 h-4" /> {job.salary}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" /> {job.type}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Swipe = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = useCallback(
    (dir: "left" | "right") => {
      setCurrentIndex((prev) => prev + 1);
    },
    []
  );

  const visibleJobs = JOBS.slice(currentIndex, currentIndex + 2);
  const allSwiped = currentIndex >= JOBS.length;

  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-foreground">Discover Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">Swipe right on roles you love</p>
        </div>

        <div className="relative h-[520px]">
          {allSwiped ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mb-6">
                <Star className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-extrabold text-foreground mb-2">All caught up!</h2>
              <p className="text-muted-foreground mb-6">Check back later for new opportunities</p>
              <Button
                onClick={() => setCurrentIndex(0)}
                className="gradient-primary text-primary-foreground border-0 rounded-xl"
              >
                Start Over
              </Button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {visibleJobs
                .slice()
                .reverse()
                .map((job, i) => (
                  <SwipeCard
                    key={job.id}
                    job={job}
                    onSwipe={handleSwipe}
                    isTop={i === visibleJobs.length - 1}
                  />
                ))}
            </AnimatePresence>
          )}
        </div>

        {/* Action buttons */}
        {!allSwiped && (
          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={() => handleSwipe("left")}
              className="w-16 h-16 rounded-full border-2 border-destructive/30 flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>
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
