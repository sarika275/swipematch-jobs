import { motion } from "framer-motion";
import { MessageCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MATCHES = [
  { id: 1, company: "TechFlow", role: "Senior Frontend Engineer", time: "Matched 2h ago", color: "from-[hsl(12,90%,58%)] to-[hsl(33,100%,55%)]" },
  { id: 2, company: "DesignLab", role: "Product Designer", time: "Matched 1d ago", color: "from-[hsl(250,80%,60%)] to-[hsl(280,90%,65%)]" },
  { id: 3, company: "DataStream", role: "Backend Engineer", time: "Matched 3d ago", color: "from-[hsl(180,60%,45%)] to-[hsl(200,80%,50%)]" },
];

const Matches = () => {
  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-extrabold text-foreground mb-1">Matches</h1>
        <p className="text-sm text-muted-foreground mb-8">You matched with {MATCHES.length} companies</p>

        {MATCHES.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No matches yet. Keep swiping!</p>
            <Link to="/swipe">
              <Button className="gradient-primary text-primary-foreground border-0 rounded-xl">
                Browse Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {MATCHES.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border shadow-card p-4 flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${match.color} flex items-center justify-center shrink-0`}>
                  <Building2 className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-card-foreground truncate">{match.role}</h3>
                  <p className="text-sm text-muted-foreground">{match.company}</p>
                  <p className="text-xs text-muted-foreground mt-1">{match.time}</p>
                </div>
                <Button size="sm" className="gradient-primary text-primary-foreground border-0 rounded-xl shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
