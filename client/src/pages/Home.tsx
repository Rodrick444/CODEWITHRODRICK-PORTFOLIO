import { motion } from "framer-motion";
import { Twitter, Linkedin, Github } from "lucide-react";
import Navbar from "@/components/Navbar";
import BrandLogo from "@/components/BrandLogo";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <BrandLogo />
      <Navbar />
      <HeroSection />
      
      <div className="section-divider" />
      
      <PortfolioSection />
      
      <div className="section-divider" />
      
      <AboutSection />
      
      <div className="section-divider" />
      
      <ContactSection />
      
      <footer className="relative overflow-hidden border-t border-primary/10 py-16">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-background to-background" />
        
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-1/2"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(217 91% 60% / 0.5), transparent)",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 -left-1/4 h-[300px] w-[300px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(217 91% 60% / 0.05), transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:gap-12 md:grid-cols-3 items-center text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-display text-2xl font-bold gradient-text neon-text mb-2">
                CODEWITHRODRICK
              </p>
              <p className="text-sm text-muted-foreground">
                Creating digital experiences that inspire
              </p>
            </motion.div>
            
            <motion.div
              className="flex justify-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-300 hover:neon-glow-sm hover:border-primary/50"
                  whileHover={{ scale: 1.1, y: -3 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`link-footer-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="h-5 w-5 text-primary" />
                </motion.a>
              ))}
            </motion.div>
            
            <motion.div
              className="text-center md:text-right"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-sm text-muted-foreground" data-testid="text-footer-copyright">
                &copy; {new Date().getFullYear()} CODEWITHRODRICK
              </p>
              <p className="text-xs text-muted-foreground/60 mt-1">
                All rights reserved
              </p>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  );
}
