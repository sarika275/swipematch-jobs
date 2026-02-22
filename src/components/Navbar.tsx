import { Link, useLocation } from "react-router-dom";
import { Briefcase, MessageCircle, User, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  if (isLanding) return null;

  const navItems = [
    { to: "/swipe", icon: Flame, label: "Swipe" },
    { to: "/matches", icon: MessageCircle, label: "Matches" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">SwipeHire</span>
          </Link>
          <Link to="/auth">
            <Button size="sm" variant="outline">Sign In</Button>
          </Link>
        </div>
      </header>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t md:top-0 md:bottom-auto">
        <div className="max-w-lg mx-auto px-4 flex items-center justify-around h-16 md:hidden">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
