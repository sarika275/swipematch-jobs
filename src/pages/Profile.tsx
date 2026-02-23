import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Briefcase, Mail, Pencil, FileText, Upload, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, role, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Candidate fields
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experienceYears, setExperienceYears] = useState(0);
  const [location, setLocation] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  // Company fields
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (!user || !role) return;

    if (role === "candidate") {
      supabase
        .from("candidate_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setName(data.name || "");
            setBio(data.bio || "");
            setSkills(data.skills || []);
            setExperienceYears(data.experience_years || 0);
            setLocation(data.location || "");
            setResumeUrl(data.resume_url || "");
          }
        });
    } else {
      supabase
        .from("company_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setCompanyName(data.company_name || "");
            setDescription(data.description || "");
            setWebsite(data.website || "");
          }
        });
    }
  }, [user, role]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      if (role === "candidate") {
        const { error } = await supabase
          .from("candidate_profiles")
          .upsert({
            user_id: user.id,
            name,
            bio,
            skills,
            experience_years: experienceYears,
            location,
            resume_url: resumeUrl,
          }, { onConflict: "user_id" });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("company_profiles")
          .upsert({
            user_id: user.id,
            company_name: companyName,
            description,
            website,
          }, { onConflict: "user_id" });
        if (error) throw error;
      }

      toast({ title: "Profile saved!" });
      setEditing(false);
    } catch (err: any) {
      toast({ title: "Error saving profile", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const filePath = `${user.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      setResumeUrl(filePath);

      // Try to parse with AI
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text();
        const { data } = await supabase.functions.invoke("parse-resume", {
          body: { resumeText: text },
        });

        if (data?.parsed) {
          const p = data.parsed;
          if (p.name) setName(p.name);
          if (p.bio) setBio(p.bio);
          if (p.skills) setSkills(p.skills);
          if (p.experience_years) setExperienceYears(p.experience_years);
          if (p.location) setLocation(p.location);
          toast({ title: "Resume parsed!", description: "Profile auto-populated from your resume." });
        }
      } else {
        toast({ title: "Resume uploaded!", description: "AI parsing works best with .txt files for now." });
      }
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  if (authLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-pulse text-muted-foreground">Loading...</div></div>;
  if (!user) return <Navigate to="/auth" replace />;

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
                  <h1 className="text-xl font-extrabold text-card-foreground">
                    {role === "candidate" ? name || "Your Name" : companyName || "Company Name"}
                  </h1>
                  <p className="text-sm text-muted-foreground">{role === "candidate" ? "Candidate" : "Recruiter"}</p>
                </div>
                <Button size="sm" variant="outline" className="rounded-xl" onClick={() => editing ? handleSave() : setEditing(true)} disabled={saving}>
                  {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : editing ? <Save className="w-3 h-3 mr-1" /> : <Pencil className="w-3 h-3 mr-1" />}
                  {editing ? "Save" : "Edit"}
                </Button>
              </div>
            </div>
          </div>

          {role === "candidate" ? (
            <div className="space-y-4">
              {/* Details */}
              <div className="bg-card rounded-2xl border shadow-card p-5 space-y-3">
                <h2 className="font-bold text-card-foreground mb-3">Details</h2>
                {editing ? (
                  <div className="space-y-3">
                    <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl" />
                    <textarea
                      placeholder="Bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-background text-sm resize-none h-20"
                    />
                    <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} className="rounded-xl" />
                    <Input type="number" placeholder="Years of Experience" value={experienceYears} onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)} className="rounded-xl" />
                  </div>
                ) : (
                  <>
                    {location && <div className="flex items-center gap-3 text-sm text-muted-foreground"><MapPin className="w-4 h-4 text-primary" /> {location}</div>}
                    <div className="flex items-center gap-3 text-sm text-muted-foreground"><Briefcase className="w-4 h-4 text-primary" /> {experienceYears} years experience</div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground"><Mail className="w-4 h-4 text-primary" /> {user.email}</div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <FileText className="w-4 h-4 text-primary" /> {resumeUrl ? "Resume uploaded" : "No resume"}
                    </div>
                  </>
                )}
              </div>

              {/* Resume upload */}
              <div className="bg-card rounded-2xl border shadow-card p-5">
                <h2 className="font-bold text-card-foreground mb-3">Resume</h2>
                <input ref={fileRef} type="file" accept=".pdf,.txt,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  {uploading ? "Parsing..." : "Upload Resume"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">Upload a .txt file for AI-powered profile auto-fill</p>
              </div>

              {/* Skills */}
              <div className="bg-card rounded-2xl border shadow-card p-5">
                <h2 className="font-bold text-card-foreground mb-3">Skills</h2>
                {editing && (
                  <div className="flex gap-2 mb-3">
                    <Input
                      placeholder="Add a skill"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      className="rounded-xl"
                    />
                    <Button size="sm" onClick={addSkill} className="rounded-xl">Add</Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      onClick={() => editing && removeSkill(skill)}
                      className={`px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold ${editing ? "cursor-pointer hover:bg-destructive/10 hover:text-destructive" : ""}`}
                    >
                      {skill} {editing && "×"}
                    </span>
                  ))}
                  {skills.length === 0 && <p className="text-sm text-muted-foreground">No skills added yet</p>}
                </div>
              </div>

              {bio && !editing && (
                <div className="bg-card rounded-2xl border shadow-card p-5">
                  <h2 className="font-bold text-card-foreground mb-3">About</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card rounded-2xl border shadow-card p-5 space-y-3">
                <h2 className="font-bold text-card-foreground mb-3">Company Details</h2>
                {editing ? (
                  <div className="space-y-3">
                    <Input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="rounded-xl" />
                    <textarea
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border bg-background text-sm resize-none h-20"
                    />
                    <Input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} className="rounded-xl" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground"><Mail className="w-4 h-4 text-primary" /> {user.email}</div>
                    {website && <div className="flex items-center gap-3 text-sm text-muted-foreground"><FileText className="w-4 h-4 text-primary" /> {website}</div>}
                    {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
                  </>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
