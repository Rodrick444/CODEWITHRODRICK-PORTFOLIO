import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, Briefcase, User, Mail } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Portfolio", href: "#portfolio", icon: Briefcase },
  { label: "About", href: "#about", icon: User },
  { label: "Contact", href: "#contact", icon: Mail },
];

export default function Navbar() {
  const [, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navItems.map((item) => item.href.substring(1));
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const sectionId = href.substring(1);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogoPointerDown = () => {
    pressStartRef.current = Date.now();
    pressTimerRef.current = setTimeout(() => {
      setLocation("/admin/login");
    }, 3000);
  };

  const handleLogoPointerUp = () => {
    const pressDuration = Date.now() - pressStartRef.current;
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
    if (pressDuration < 3000) {
      scrollToSection("#home");
    }
  };

  const handleLogoPointerLeave = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleLogoClick = () => {
    scrollToSection("#home");
  };

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "glassmorphism border-b border-primary/10 shadow-lg shadow-primary/5"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between relative">
            <motion.button
              className="font-display text-sm sm:text-lg md:text-2xl font-bold gradient-text relative group z-10"
              onClick={handleLogoClick}
              onPointerDown={handleLogoPointerDown}
              onPointerUp={handleLogoPointerUp}
              onPointerLeave={handleLogoPointerLeave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              data-testid="button-logo"
            >
              <span className="relative z-10">CODEWITHRODRICK</span>
              <motion.span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "linear-gradient(90deg, hsl(217 91% 60% / 0.2), hsl(190 95% 55% / 0.2))",
                  filter: "blur(8px)",
                }}
              />
            </motion.button>

            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.label} className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => scrollToSection(item.href)}
                      className={`relative px-1.5 sm:px-3 md:px-6 py-1.5 sm:py-2 md:py-3 transition-all duration-300 font-semibold text-xs sm:text-sm md:text-lg ${
                        activeSection === item.href.substring(1)
                          ? "text-primary"
                          : "text-foreground/80 hover:text-foreground"
                      }`}
                      data-testid={`button-nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 md:mr-2" />
                      <span className="hidden md:inline">{item.label}</span>
                    </Button>
                    {activeSection === item.href.substring(1) && (
                      <motion.div
                        className="absolute -bottom-1 left-1/2 h-0.5 bg-primary rounded-full neon-glow-sm"
                        layoutId="activeNavIndicator"
                        initial={{ width: 0, x: "-50%" }}
                        animate={{ width: "70%", x: "-50%" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
