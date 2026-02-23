import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, Zap, MessageCircle, Shield, Sparkles, Star, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Swipe to Match",
    description: "Browse jobs or candidates with an intuitive swipe interface. Right for interested, left to pass.",
  },
  {
    icon: MessageCircle,
    title: "Instant Chat",
    description: "When both sides swipe right, a conversation opens instantly. No more waiting.",
  },
  {
    icon: Shield,
    title: "Smart Matching",
    description: "AI-powered compatibility scoring surfaces the most relevant opportunities based on skills and preferences.",
  },
];

const testimonials = [
  {
    name: "Sarah K.",
    role: "Frontend Engineer",
    quote: "Found my dream job at a startup within a week of using SwipeHire. The swipe interface made job hunting actually fun!",
    avatar: "SK",
  },
  {
    name: "Mike R.",
    role: "CTO at NovaTech",
    quote: "We've hired 12 engineers through SwipeHire. The quality of matches is incredible compared to traditional job boards.",
    avatar: "MR",
  },
  {
    name: "Lisa T.",
    role: "Product Designer",
    quote: "The AI matching is spot on. Every job suggestion felt personally curated for my skillset.",
    avatar: "LT",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-xl text-foreground">SwipeHire</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-primary text-primary-foreground border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              The future of hiring is here
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-6">
              Swipe Your Way to{" "}
              <span className="text-gradient">Dream Jobs</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              SwipeHire connects talent with opportunity through an intuitive swipe interface.
              Match with your next role or perfect candidate in seconds.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary text-primary-foreground border-0 text-base px-8 h-12 rounded-xl shadow-card">
                Find Jobs <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-base px-8 h-12 rounded-xl">
                <Users className="w-4 h-4 mr-2" /> I'm Hiring
              </Button>
            </Link>
          </motion.div>

          {/* Mock cards preview */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="mt-20 relative max-w-sm mx-auto">
            <div className="absolute -left-8 top-8 w-72 h-96 rounded-2xl bg-muted border rotate-[-8deg] shadow-card" />
            <div className="absolute -right-8 top-8 w-72 h-96 rounded-2xl bg-muted border rotate-[8deg] shadow-card" />
            <div className="relative w-72 h-96 mx-auto rounded-2xl bg-card border shadow-elevated overflow-hidden">
              <div className="h-48 gradient-hero" />
              <div className="p-5">
                <h3 className="font-bold text-lg text-card-foreground">Senior Designer</h3>
                <p className="text-sm text-muted-foreground mt-1">Acme Corp · Remote</p>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">Figma</span>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">UI/UX</span>
                  <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">$120k+</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">Three simple steps to your next opportunity</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl p-8 border shadow-card"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg text-card-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* For Candidates */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <Star className="w-3 h-3" /> For Candidates
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Your dream job is one swipe away</h2>
            <div className="space-y-4">
              {["Upload your resume and let AI build your profile", "Swipe through curated job matches", "Chat directly with recruiters", "Track your matches and applications"].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="w-full aspect-square rounded-3xl gradient-primary opacity-10 absolute inset-0" />
            <div className="relative bg-card rounded-2xl border shadow-elevated p-8 flex flex-col items-center justify-center">
              <TrendingUp className="w-16 h-16 text-primary mb-4" />
              <p className="text-4xl font-extrabold text-foreground">87%</p>
              <p className="text-muted-foreground text-sm mt-1">Average compatibility match</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* For Recruiters */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-2 md:order-1 relative">
            <div className="w-full aspect-square rounded-3xl gradient-dark opacity-10 absolute inset-0" />
            <div className="relative bg-card rounded-2xl border shadow-elevated p-8 flex flex-col items-center justify-center">
              <Users className="w-16 h-16 text-primary mb-4" />
              <p className="text-4xl font-extrabold text-foreground">3x</p>
              <p className="text-muted-foreground text-sm mt-1">Faster time to hire</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
              <Briefcase className="w-3 h-3" /> For Recruiters
            </div>
            <h2 className="text-3xl font-extrabold text-foreground mb-4">Find your perfect candidate faster</h2>
            <div className="space-y-4">
              {["AI-powered candidate summaries", "Compatibility scoring on every profile", "Swipe to shortlist top talent", "Built-in messaging for instant outreach"].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                  <p className="text-muted-foreground text-sm">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">Loved by thousands</h2>
            <p className="text-muted-foreground text-lg">See what our users have to say</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 border shadow-card"
              >
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-card-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-primary rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">Ready to SwipeHire?</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Join thousands already finding their perfect match.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-card text-foreground hover:bg-card/90 text-base px-8 h-12 rounded-xl">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 SwipeHire</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
