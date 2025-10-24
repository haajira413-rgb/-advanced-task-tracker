import {
  type User,
  type InsertUser,
  type Task,
  type InsertTask,
  type Project,
  type InsertProject,
  type Achievement,
  type InsertAchievement,
  type FocusSession,
  type InsertFocusSession,
  type Category,
  type InsertCategory,
  type ProductivityStats,
  type CategoryStats,
  type HeatmapData,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;

  // Task operations
  getTasks(userId: string): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, task: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  getTasksByStatus(userId: string, status: string): Promise<Task[]>;
  getTasksByPriority(userId: string, priority: number): Promise<Task[]>;
  completeTask(id: string): Promise<Task | undefined>;

  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;

  // Achievement operations
  getAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;

  // Focus session operations
  getFocusSessions(userId: string): Promise<FocusSession[]>;
  createFocusSession(session: InsertFocusSession): Promise<FocusSession>;
  completeFocusSession(id: string, endTime: Date, duration: number): Promise<FocusSession | undefined>;

  // Category operations
  getCategories(userId: string): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Analytics operations
  getProductivityStats(userId: string): Promise<ProductivityStats>;
  getCategoryStats(userId: string): Promise<CategoryStats[]>;
  getHeatmapData(userId: string, startDate: Date, endDate: Date): Promise<HeatmapData[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tasks: Map<string, Task>;
  private projects: Map<string, Project>;
  private achievements: Map<string, Achievement>;
  private focusSessions: Map<string, FocusSession>;
  private categories: Map<string, Category>;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.projects = new Map();
    this.achievements = new Map();
    this.focusSessions = new Map();
    this.categories = new Map();

    // Initialize with a default user
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const defaultUser: User = {
      id: "default-user",
      username: "User",
      email: "user@tasktracker.com",
      profileImage: null,
      totalXp: 250,
      level: 3,
      streakDays: 5,
      lastActivityDate: new Date(),
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Add default categories
    const defaultCategories: Category[] = [
      { id: randomUUID(), userId: "default-user", name: "Work", color: "#3b82f6", icon: "briefcase", createdAt: new Date() },
      { id: randomUUID(), userId: "default-user", name: "Personal", color: "#8b5cf6", icon: "user", createdAt: new Date() },
      { id: randomUUID(), userId: "default-user", name: "Learning", color: "#10b981", icon: "book", createdAt: new Date() },
      { id: randomUUID(), userId: "default-user", name: "Health", color: "#f59e0b", icon: "heart", createdAt: new Date() },
    ];
    defaultCategories.forEach(cat => this.categories.set(cat.id, cat));
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      profileImage: null,
      totalXp: 0,
      level: 1,
      streakDays: 0,
      lastActivityDate: null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Task operations
  async getTasks(userId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter((task) => task.userId === userId);
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      tags: insertTask.tags || [],
      completedAt: null,
      createdAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updated = { ...task, ...updates };
    this.tasks.set(id, updated);
    return updated;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  async getTasksByStatus(userId: string, status: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId && task.status === status
    );
  }

  async getTasksByPriority(userId: string, priority: number): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(
      (task) => task.userId === userId && task.priority === priority
    );
  }

  async completeTask(id: string): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    const updated = {
      ...task,
      status: "completed" as const,
      completedAt: new Date(),
    };
    this.tasks.set(id, updated);
    return updated;
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter((p) => p.userId === userId);
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    const updated = { ...project, ...updates };
    this.projects.set(id, updated);
    return updated;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Achievement operations
  async getAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter((a) => a.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      earnedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  // Focus session operations
  async getFocusSessions(userId: string): Promise<FocusSession[]> {
    return Array.from(this.focusSessions.values()).filter((s) => s.userId === userId);
  }

  async createFocusSession(insertSession: InsertFocusSession): Promise<FocusSession> {
    const id = randomUUID();
    const session: FocusSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.focusSessions.set(id, session);
    return session;
  }

  async completeFocusSession(
    id: string,
    endTime: Date,
    duration: number
  ): Promise<FocusSession | undefined> {
    const session = this.focusSessions.get(id);
    if (!session) return undefined;
    const updated = { ...session, endTime, duration };
    this.focusSessions.set(id, updated);
    return updated;
  }

  // Category operations
  async getCategories(userId: string): Promise<Category[]> {
    return Array.from(this.categories.values()).filter((c) => c.userId === userId);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date(),
    };
    this.categories.set(id, category);
    return category;
  }

  // Analytics operations
  async getProductivityStats(userId: string): Promise<ProductivityStats> {
    const tasks = await this.getTasks(userId);
    const user = await this.getUser(userId);
    const completedTasks = tasks.filter((t) => t.status === "completed");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tasksToday = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      return taskDate.getTime() === today.getTime();
    });

    const avgCompletionTime =
      completedTasks.filter((t) => t.actualDuration).reduce((sum, t) => sum + (t.actualDuration || 0), 0) /
      (completedTasks.filter((t) => t.actualDuration).length || 1);

    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRate: tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0,
      totalXp: user?.totalXp || 0,
      level: user?.level || 1,
      streakDays: user?.streakDays || 0,
      tasksToday: tasksToday.length,
      avgCompletionTime: Math.round(avgCompletionTime),
    };
  }

  async getCategoryStats(userId: string): Promise<CategoryStats[]> {
    const tasks = await this.getTasks(userId);
    const categoryCount = new Map<string, number>();

    tasks.forEach((task) => {
      if (task.category) {
        categoryCount.set(task.category, (categoryCount.get(task.category) || 0) + 1);
      }
    });

    const total = tasks.filter((t) => t.category).length;
    return Array.from(categoryCount.entries()).map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0,
    }));
  }

  async getHeatmapData(userId: string, startDate: Date, endDate: Date): Promise<HeatmapData[]> {
    const tasks = await this.getTasks(userId);
    const dateCount = new Map<string, number>();

    tasks.forEach((task) => {
      if (task.completedAt) {
        const date = new Date(task.completedAt);
        const dateStr = date.toISOString().split("T")[0];
        if (date >= startDate && date <= endDate) {
          dateCount.set(dateStr, (dateCount.get(dateStr) || 0) + 1);
        }
      }
    });

    return Array.from(dateCount.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }
}

export const storage = new MemStorage();
