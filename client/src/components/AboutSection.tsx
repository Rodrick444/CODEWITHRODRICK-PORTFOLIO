import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Code2, Palette, Rocket, Zap, Globe, Database } from "lucide-react";
import type { Profile } from "@shared/schema";

const highlights = [
  {
    icon: Code2,
    title: "Clean Code",
    description: "Maintainable, scalable solutions",
  },
  {
    icon: Palette,
    title: "Beautiful Design",
    description: "Stunning interfaces users love",
  },
  {
    icon: Rocket,
    title: "Fast Delivery",
    description: "On-time with exceptional quality",
  },
];

const skillIcons: Record<string, typeof Code2> = {
  "React": Globe,
  "TypeScript": Code2,
  "Node.js": Database,
  "Tailwind CSS": Palette,
  "UI/UX Design": Palette,
  "Responsive Design": Globe,
  "API Development": Database,
  "Database Design": Database,
};

export default function AboutSection() {
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: ["/api/profile"],
  });

  const bio1 = profile?.bio1 || "Hi, I'm Rodrick! I'm a passionate web developer and designer with a love for creating beautiful, functional websites that make a real impact. With over 5 years of experience, I've had the privilege of working with clients from startups to established businesses.";
  const bio2 = profile?.bio2 || "My approach combines clean code with stunning design. I believe every website should not only look great but also provide an exceptional user experience. From concept to launch, I'm dedicated to bringing your vision to life.";
  const bio3 = profile?.bio3 || "When I'm not coding, you'll find me exploring new design trends, contributing to open-source projects, or enjoying a good cup of coffee while sketching out my next creative idea.";
  const skills = profile?.skills || ["React", "TypeScript", "Node.js", "Tailwind CSS", "UI/UX Design", "Responsive Design", "API Development", "Database Design"];

  return (
    <section id="about" className="relative w-full py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full"
          style={{
            background: "linear-gradient(135deg, hsl(217 91% 60% / 0.05), transparent)",
            clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(190 95% 55% / 0.08), transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="mb-6 inline-block"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium border border-primary/30 bg-primary/10 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-primary">About Me</span>
            </div>
          </motion.div>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="flex justify-center lg:col-span-2">
              <div className="h-72 w-72 rounded-full bg-muted/50 animate-pulse" />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="h-12 bg-muted/50 rounded animate-pulse" />
              <div className="h-4 bg-muted/50 rounded animate-pulse" />
              <div className="h-4 bg-muted/50 rounded w-3/4 animate-pulse" />
            </div>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16 items-center">
            <motion.div
              className="flex justify-center lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <motion.div
                  className="absolute -inset-8 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, hsl(217 91% 60% / 0.2), hsl(190 95% 55% / 0.15), hsl(270 91% 65% / 0.1))",
                    filter: "blur(40px)",
                  }}
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                <div className="relative h-48 w-48 sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary neon-glow-sm" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute inset-4 rounded-full border border-cyan-400/20"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-2 rounded-full bg-cyan-400" />
                  </motion.div>
                  
                  <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-primary/20 bg-gradient-to-br from-primary/20 via-cyan-400/10 to-purple-500/10 backdrop-blur-sm">
                    {profile?.profileImageUrl ? (
                      <img
                        src={profile.profileImageUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        data-testid="img-profile"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                          <svg viewBox="0 0 100 140" className="w-20 h-28 sm:w-32 sm:h-44 lg:w-40 lg:h-56">
                            <defs>
                              <linearGradient id="silhouetteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity="0.6" />
                                <stop offset="50%" stopColor="hsl(190, 95%, 55%)" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="hsl(270, 91%, 65%)" stopOpacity="0.3" />
                              </linearGradient>
                              <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                                <feMerge>
                                  <feMergeNode in="coloredBlur"/>
                                  <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                              </filter>
                            </defs>
                            <ellipse cx="50" cy="30" rx="22" ry="26" fill="url(#silhouetteGradient)" filter="url(#glow)" />
                            <path d="M50 56 C20 56 10 85 10 120 L10 140 L90 140 L90 120 C90 85 80 56 50 56" fill="url(#silhouetteGradient)" filter="url(#glow)" />
                          </svg>
                          <motion.div
                            className="absolute inset-0"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {[Code2, Palette, Rocket].map((Icon, index) => (
                  <motion.div
                    key={index}
                    className="absolute h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-card/80 backdrop-blur-sm border border-primary/20 items-center justify-center hidden sm:flex"
                    style={{
                      top: `${20 + index * 30}%`,
                      left: index % 2 === 0 ? "-15%" : "105%",
                    }}
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 3,
                      delay: index * 0.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="mb-4 sm:mb-6 font-display text-2xl sm:text-4xl font-bold tracking-tight lg:text-5xl text-center lg:text-left"
                data-testid="text-about-heading"
              >
                <span className="gradient-text">Hi, I'm Rodrick!</span>
              </h2>

              <div className="space-y-3 sm:space-y-4 text-base sm:text-lg text-muted-foreground text-center lg:text-left">
                <p data-testid="text-about-bio-1">{bio1}</p>
                <p data-testid="text-about-bio-2">{bio2}</p>
                <p data-testid="text-about-bio-3">{bio3}</p>
              </div>

              <div className="mt-6 sm:mt-10 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    className="card-futuristic p-5"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    data-testid={`card-highlight-${item.title.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 neon-glow-sm">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 sm:mt-10">
                <h3
                  className="mb-4 sm:mb-6 font-display text-lg sm:text-xl font-semibold gradient-text text-center lg:text-left"
                  data-testid="text-skills-heading"
                >
                  Skills & Expertise
                </h3>
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
                  {skills.map((skill, index) => {
                    const Icon = skillIcons[skill] || Zap;
                    return (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <span
                          className="skill-badge"
                          data-testid={`badge-skill-${skill.toLowerCase().replace(/[.\s]/g, '-')}`}
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          {skill}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
