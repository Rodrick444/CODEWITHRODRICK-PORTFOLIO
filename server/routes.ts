import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { sendEmail } from "./gmail";
import { uploadToSupabase } from "./supabaseStorage";
import { insertProjectSchema, insertProfileSchema, insertAdminUserSchema } from "@shared/schema";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "codewithkayla-secret-key-change-in-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    })
  );

  // Legacy /uploads fallback for existing local images (secured - only serves image files)
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.get("/uploads/:filename", (req, res) => {
    const filename = req.params.filename;
    const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;
    
    if (!allowedExtensions.test(filename) || filename.includes("..") || filename.includes("/")) {
      return res.status(404).json({ error: "File not found" });
    }
    
    const filePath = path.join(uploadsDir, filename);
    const resolvedPath = path.resolve(filePath);
    
    if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
      return res.status(404).json({ error: "File not found" });
    }
    
    if (fs.existsSync(resolvedPath)) {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.sendFile(resolvedPath);
    } else {
      res.status(404).json({ error: "File not found" });
    }
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const adminExists = await storage.adminExists();
      if (adminExists) {
        return res.status(403).json({ error: "Admin account already exists. Registration is closed." });
      }

      const existingUser = await storage.getAdminUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const parsed = insertAdminUserSchema.parse(req.body);
      const hashedPassword = await bcrypt.hash(parsed.password, 10);

      const user = await storage.createAdminUser({
        username: parsed.username,
        password: hashedPassword,
      });

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getAdminUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await storage.getAdminUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ id: user.id, username: user.username, profileImageUrl: user.profileImageUrl });
  });

  app.get("/api/auth/admin-exists", async (req, res) => {
    try {
      const exists = await storage.adminExists();
      res.json({ exists });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Current and new passwords are required" });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }

      const user = await storage.getAdminUser(req.session.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await storage.updateAdminPassword(req.session.userId!, hashedPassword);

      if (!updated) {
        return res.status(500).json({ error: "Failed to update password" });
      }

      res.json({ success: true, message: "Password updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/update-profile-image", requireAuth, upload.single("image"), async (req, res) => {
    try {
      let imageUrl: string | null = null;
      
      if (req.file) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const fileName = `profile/${uniqueSuffix}${path.extname(req.file.originalname)}`;
        imageUrl = await uploadToSupabase(req.file.buffer, fileName, req.file.mimetype);
      }
      
      const updated = await storage.updateAdminProfileImage(req.session.userId!, imageUrl);

      if (!updated) {
        return res.status(500).json({ error: "Failed to update profile image" });
      }

      res.json({ success: true, profileImageUrl: imageUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Image Upload Route
  app.post("/api/upload", requireAuth, upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = `projects/${uniqueSuffix}${path.extname(req.file.originalname)}`;
      const imageUrl = await uploadToSupabase(req.file.buffer, fileName, req.file.mimetype);
      
      res.json({ imageUrl });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Project Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const parsed = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(parsed);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.updateProject(req.params.id, req.body);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Profile Routes
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/profile", requireAuth, async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.body);
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.patch("/api/profile/image", requireAuth, async (req, res) => {
    try {
      const { profileImageUrl } = req.body;
      const profile = await storage.updateProfile({ profileImageUrl });
      res.json(profile);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Contact Form Email Route
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }

      const profile = await storage.getProfile();
      const toEmail = profile?.contactEmail || "hello@codewithrodrick.com";

      await sendEmail(
        toEmail,
        `Portfolio Contact: ${name}`,
        `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
        email
      );

      res.json({ success: true });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ error: "Failed to send email. Please try again later." });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
