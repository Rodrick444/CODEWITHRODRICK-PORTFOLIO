import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Layers, Eye } from "lucide-react";
import DeviceFrame from "./DeviceFrame";
import ProjectDetailModal from "./ProjectDetailModal";
import type { Project } from "@shared/schema";

export default function PortfolioSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  return (
    <section id="portfolio" className="relative w-full py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 -left-1/4 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(217 91% 60% / 0.08), transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
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
              <Layers className="h-4 w-4 text-primary" />
              <span className="text-primary">Portfolio</span>
            </div>
          </motion.div>
          <h2
            className="mb-4 font-display text-2xl sm:text-4xl font-bold tracking-tight lg:text-5xl"
            data-testid="text-portfolio-heading"
          >
            <span className="gradient-text">Featured Projects</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-portfolio-description">
            A showcase of my recent work and client collaborations, built with cutting-edge technology
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="card-futuristic p-2">
                  <div className="aspect-[4/3] bg-muted/50 rounded-lg animate-shimmer" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted/50 rounded w-3/4" />
                    <div className="h-4 bg-muted/50 rounded w-full" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-muted/50 rounded-full" />
                      <div className="h-6 w-20 bg-muted/50 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="card-futuristic p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Layers className="h-10 w-10 text-primary" />
              </div>
              <p className="text-muted-foreground text-lg">
                Amazing projects coming soon. Stay tuned!
              </p>
            </Card>
          </motion.div>
        ) : (
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:gap-10">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className="group card-futuristic cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                  data-testid={`card-project-${project.id}`}
                >
                  <div className="relative overflow-hidden rounded-t-xl">
                    <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800/50 dark:to-slate-900/50 p-8">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <DeviceFrame
                          imageUrl={project.imageUrl}
                          imageUrls={(project as any).imageUrls}
                          deviceType={project.deviceType as "monitor" | "phone" | "tablet"}
                          alt={project.title}
                        />
                      </motion.div>
                    </div>
                    <div className="absolute top-4 right-4 rounded-full bg-background/80 backdrop-blur-sm p-2.5 opacity-0 transition-all duration-300 group-hover:opacity-100 neon-glow-sm">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-6">
                    <h3
                      className="mb-3 font-display text-2xl font-semibold text-foreground transition-colors group-hover:gradient-text"
                      data-testid={`text-project-title-${project.id}`}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="mb-4 text-base text-muted-foreground line-clamp-2"
                      data-testid={`text-project-description-${project.id}`}
                    >
                      {project.description}
                    </p>
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="skill-badge text-xs"
                            data-testid={`badge-tag-${tag.toLowerCase()}`}
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 3 && (
                          <span className="skill-badge text-xs">
                            +{project.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    <Button
                      className="mt-4 w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project);
                      }}
                      data-testid={`button-view-project-${project.id}`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Project
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ProjectDetailModal
        project={selectedProject}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
}
