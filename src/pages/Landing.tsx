import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Briefcase, Users, Zap, MessageCircle, Shield, Sparkles } from "lucide-react";
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
    description: "Our algorithm surfaces the most relevant opportunities based on skills and preferences.",
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative max-w-sm mx-auto"
          >
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

      {/* Features */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Three simple steps to your next opportunity
            </p>
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

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-primary rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground mb-4">
              Ready to SwipeHire?
            </h2>
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
