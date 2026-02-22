import { motion } from "framer-motion";
import { User, MapPin, Briefcase, Mail, Pencil, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background pt-16 pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="relative rounded-3xl overflow-hidden mb-6">
            <div className="h-32 gradient-hero" />
            <div className="bg-card px-6 pb-6 pt-12 rounded-b-3xl border-x border-b">
              <div className="absolute top-20 left-6 w-20 h-20 rounded-2xl bg-card border-4 border-card shadow-card flex items-center justify-center">
                <User className="w-10 h-10 text-muted-foreground" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-extrabold text-card-foreground">Alex Johnson</h1>
                  <p className="text-sm text-muted-foreground">Frontend Engineer</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl">
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border shadow-card p-5 space-y-3">
              <h2 className="font-bold text-card-foreground mb-3">Details</h2>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" /> San Francisco, CA
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4 text-primary" /> 5 years experience
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" /> alex@example.com
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <FileText className="w-4 h-4 text-primary" /> Resume uploaded
              </div>
            </div>

            <div className="bg-card rounded-2xl border shadow-card p-5">
              <h2 className="font-bold text-card-foreground mb-3">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {["React", "TypeScript", "Tailwind CSS", "Node.js", "GraphQL", "Figma"].map((skill) => (
                  <span key={skill} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-2xl border shadow-card p-5">
              <h2 className="font-bold text-card-foreground mb-3">Preferences</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>💰 $140k - $200k</p>
                <p>📍 Remote preferred</p>
                <p>⏰ Full-time</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
