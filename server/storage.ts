import { type User, type InsertUser, type VideoGeneration, type InsertVideoGeneration } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createVideoGeneration(generation: InsertVideoGeneration): Promise<VideoGeneration>;
  getVideoGeneration(id: string): Promise<VideoGeneration | undefined>;
  updateVideoGeneration(id: string, updates: Partial<VideoGeneration>): Promise<VideoGeneration | undefined>;
  getVideoGenerations(limit?: number): Promise<VideoGeneration[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private videoGenerations: Map<string, VideoGeneration>;

  constructor() {
    this.users = new Map();
    this.videoGenerations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createVideoGeneration(insertGeneration: InsertVideoGeneration): Promise<VideoGeneration> {
    const id = randomUUID();
    const generation: VideoGeneration = {
      id,
      characterImageUrl: insertGeneration.characterImageUrl,
      script: insertGeneration.script,
      duration: insertGeneration.duration || 5,
      quality: insertGeneration.quality || "768",
      videoUrl: null,
      status: "pending",
      createdAt: new Date(),
    };
    this.videoGenerations.set(id, generation);
    return generation;
  }

  async getVideoGeneration(id: string): Promise<VideoGeneration | undefined> {
    return this.videoGenerations.get(id);
  }

  async updateVideoGeneration(id: string, updates: Partial<VideoGeneration>): Promise<VideoGeneration | undefined> {
    const existing = this.videoGenerations.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.videoGenerations.set(id, updated);
    return updated;
  }

  async getVideoGenerations(limit = 10): Promise<VideoGeneration[]> {
    return Array.from(this.videoGenerations.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
