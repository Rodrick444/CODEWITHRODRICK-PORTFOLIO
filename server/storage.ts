import {
  type AdminUser,
  type InsertAdminUser,
  type Project,
  type InsertProject,
  type Profile,
  type InsertProfile,
  adminUsers,
  projects,
  profile as profileTable,
} from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  adminExists(): Promise<boolean>;
  updateAdminPassword(id: string, password: string): Promise<AdminUser | undefined>;
  updateAdminProfileImage(id: string, imageUrl: string | null): Promise<AdminUser | undefined>;

  getAllProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: Partial<InsertProfile>): Promise<Profile>;
}

export class DatabaseStorage implements IStorage {
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const exists = await this.adminExists();
    if (exists) {
      throw new Error("Admin account already exists. Only one admin is allowed.");
    }

    const [user] = await db.insert(adminUsers).values(insertUser).returning();
    return user;
  }

  async adminExists(): Promise<boolean> {
    const users = await db.select().from(adminUsers).limit(1);
    return users.length > 0;
  }

  async updateAdminPassword(id: string, password: string): Promise<AdminUser | undefined> {
    const [user] = await db
      .update(adminUsers)
      .set({ password })
      .where(eq(adminUsers.id, id))
      .returning();
    return user;
  }

  async updateAdminProfileImage(id: string, imageUrl: string | null): Promise<AdminUser | undefined> {
    const [user] = await db
      .update(adminUsers)
      .set({ profileImageUrl: imageUrl })
      .where(eq(adminUsers.id, id))
      .returning();
    return user;
  }

  async getAllProjects(): Promise<Project[]> {
    return db.select().from(projects).orderBy(asc(projects.orderIndex));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db
      .update(projects)
      .set(updates)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id)).returning();
    return result.length > 0;
  }

  async getProfile(): Promise<Profile | undefined> {
    const [existingProfile] = await db.select().from(profileTable).limit(1);
    
    if (!existingProfile) {
      const [newProfile] = await db.insert(profileTable).values({
        bio1: "Hi, I'm Rodrick! I'm a passionate web developer and designer with a love for creating beautiful, functional websites that make a real impact. With over 5 years of experience, I've had the privilege of working with clients from startups to established businesses.",
        bio2: "My approach combines clean code with stunning design. I believe every website should not only look great but also provide an exceptional user experience. From concept to launch, I'm dedicated to bringing your vision to life.",
        bio3: "When I'm not coding, you'll find me exploring new design trends, contributing to open-source projects, or enjoying a good cup of coffee while sketching out my next creative idea.",
        skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "UI/UX Design", "Responsive Design", "API Development", "Database Design"],
        contactEmail: "rodrickadeboye@gmail.com",
      }).returning();
      return newProfile;
    }
    
    return existingProfile;
  }

  async updateProfile(updates: Partial<InsertProfile>): Promise<Profile> {
    const existingProfile = await this.getProfile();
    
    if (!existingProfile) {
      const [newProfile] = await db.insert(profileTable).values({
        ...updates,
        bio1: updates.bio1 || "",
        bio2: updates.bio2 || "",
        bio3: updates.bio3 || "",
        skills: updates.skills || [],
        contactEmail: updates.contactEmail || "hello@codewithrodrick.com",
      }).returning();
      return newProfile;
    }

    const [updatedProfile] = await db
      .update(profileTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(profileTable.id, existingProfile.id))
      .returning();
    
    return updatedProfile;
  }
}

export const storage = new DatabaseStorage();
