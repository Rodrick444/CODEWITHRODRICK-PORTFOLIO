import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Clock, CheckCircle2, Send, MessageSquare } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Twitter, Linkedin, Github } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const WHATSAPP_NUMBER = "+2349046490562";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/contact", formData);

      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Failed to send message",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative w-full py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <motion.div
          className="absolute top-1/4 -right-1/4 h-[600px] w-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(217 91% 60% / 0.1), transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-1/4 h-[500px] w-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(190 95% 55% / 0.08), transparent 70%)",
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
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
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-primary">Contact</span>
            </div>
          </motion.div>
          <h2
            className="mb-4 font-display text-2xl sm:text-4xl font-bold tracking-tight lg:text-5xl"
            data-testid="text-contact-heading"
          >
            <span className="gradient-text">Get in Touch</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-contact-description">
            Have a project in mind? Let's work together to create something amazing
          </p>
        </motion.div>

        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="card-futuristic p-4 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="glowing-input bg-background/50 border-primary/20 focus:border-primary/50"
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="glowing-input bg-background/50 border-primary/20 focus:border-primary/50"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-foreground">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    className="glowing-input bg-background/50 border-primary/20 focus:border-primary/50 resize-none"
                    data-testid="input-message"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full group bg-primary hover:bg-primary/90 neon-glow transition-all duration-300"
                  disabled={isSubmitting}
                  data-testid="button-submit-contact"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="mr-2"
                      >
                        <Send className="h-4 w-4" />
                      </motion.span>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Send Message
                      <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="card-futuristic p-4 sm:p-8">
              <h3
                className="mb-4 sm:mb-6 font-display text-xl sm:text-2xl font-semibold gradient-text"
                data-testid="text-contact-info-heading"
              >
                Let's Connect
              </h3>

              <div className="space-y-4 sm:space-y-6">
                <motion.div
                  className="flex items-start gap-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-xl bg-primary/10 p-3 neon-glow-sm group-hover:neon-glow transition-all duration-300">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Email</p>
                    <p className="text-muted-foreground" data-testid="text-email-address">
                      rodrickadeboye@gmail.com
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-xl bg-primary/10 p-3 neon-glow-sm group-hover:neon-glow transition-all duration-300">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Response Time</p>
                    <p className="text-muted-foreground" data-testid="text-response-time">
                      I respond within 24 hours
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="rounded-xl bg-primary/10 p-3 neon-glow-sm group-hover:neon-glow transition-all duration-300">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Availability</p>
                    <p className="text-muted-foreground" data-testid="text-availability">
                      Currently accepting new projects
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block" data-testid="link-whatsapp-contact">
              <motion.div
                className="card-futuristic p-6 cursor-pointer group"
                style={{ borderColor: "hsl(142, 70%, 45%, 0.3)" }}
                whileHover={{ scale: 1.02, borderColor: "hsl(142, 70%, 45%, 0.6)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-[hsl(142,70%,45%)]/10 p-4 neon-glow-whatsapp">
                    <SiWhatsapp className="h-8 w-8 text-[hsl(142,70%,45%)]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-lg font-semibold text-foreground">
                      Let's chat on WhatsApp
                    </p>
                    <p className="text-[hsl(142,70%,45%)]">{WHATSAPP_NUMBER}</p>
                  </div>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-[hsl(142,70%,45%)]"
                  >
                    &rarr;
                  </motion.div>
                </div>
              </motion.div>
            </a>

            <div className="card-futuristic p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Connect with me on social media
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-300 hover:neon-glow-sm hover:border-primary/50"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.1, y: -3 }}
                    data-testid={`link-social-${social.label.toLowerCase()}`}
                  >
                    <social.icon className="h-5 w-5 text-primary" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
