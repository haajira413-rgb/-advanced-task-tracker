import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTaskSchema, insertProjectSchema, insertCategorySchema, insertFocusSessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.patch("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const status = req.query.status as string | undefined;
      const priority = req.query.priority ? parseInt(req.query.priority as string) : undefined;

      let tasks;
      if (status) {
        tasks = await storage.getTasksByStatus(userId, status);
      } else if (priority) {
        tasks = await storage.getTasksByPriority(userId, priority);
      } else {
        tasks = await storage.getTasks(userId);
      }

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  });

  app.get("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.getTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validated = insertTaskSchema.parse(req.body);
      const task = await storage.createTask({
        ...validated,
        userId: req.body.userId || "default-user",
      });

      // Calculate XP and update user
      const user = await storage.getUser(task.userId);
      if (user) {
        await storage.updateUser(user.id, {
          lastActivityDate: new Date(),
        });
      }

      res.json(task);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create task" });
      }
    }
  });

  app.patch("/api/tasks/:id", async (req, res) => {
    try {
      const task = await storage.updateTask(req.params.id, req.body);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const success = await storage.deleteTask(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  });

  app.post("/api/tasks/:id/complete", async (req, res) => {
    try {
      const task = await storage.completeTask(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      // Calculate XP reward
      let xpReward = 10; // Base XP
      if (task.priority === 1) xpReward += 15; // High priority bonus
      if (task.priority === 2) xpReward += 5; // Medium priority bonus
      if (task.parentTaskId) xpReward += 5; // Subtask bonus

      // Update user XP and level
      const user = await storage.getUser(task.userId);
      if (user) {
        const newTotalXp = user.totalXp + xpReward;
        const newLevel = Math.floor(newTotalXp / 100) + 1;

        // Update streak
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
        let newStreak = user.streakDays;

        if (lastActivity) {
          lastActivity.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

          if (daysDiff === 1) {
            newStreak += 1;
          } else if (daysDiff > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        await storage.updateUser(user.id, {
          totalXp: newTotalXp,
          level: newLevel,
          streakDays: newStreak,
          lastActivityDate: new Date(),
        });

        // Check for achievement unlocks
        if (newStreak === 7 && !await hasAchievement(user.id, "Streak Master")) {
          await storage.createAchievement({
            userId: user.id,
            badgeName: "Streak Master",
            badgeIcon: "🔥",
            description: "Maintain a 7-day streak",
          });
        }

        res.json({
          task,
          xpEarned: xpReward,
          newLevel: newLevel !== user.level,
          achievementUnlocked: newStreak === 7,
        });
      } else {
        res.json(task);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to complete task" });
    }
  });

  // Helper function
  async function hasAchievement(userId: string, badgeName: string): Promise<boolean> {
    const achievements = await storage.getAchievements(userId);
    return achievements.some((a) => a.badgeName === badgeName);
  }

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const validated = insertProjectSchema.parse(req.body);
      const project = await storage.createProject({
        ...validated,
        userId: req.body.userId || "default-user",
      });
      res.json(project);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create project" });
      }
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const success = await storage.deleteProject(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const categories = await storage.getCategories(userId);
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validated = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory({
        ...validated,
        userId: req.body.userId || "default-user",
      });
      res.json(category);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create category" });
      }
    }
  });

  // Achievement routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const achievements = await storage.getAchievements(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch achievements" });
    }
  });

  // Focus session routes
  app.get("/api/focus-sessions", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const sessions = await storage.getFocusSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch focus sessions" });
    }
  });

  app.post("/api/focus-sessions", async (req, res) => {
    try {
      const validated = insertFocusSessionSchema.parse(req.body);
      const session = await storage.createFocusSession({
        ...validated,
        userId: req.body.userId || "default-user",
      });
      res.json(session);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create focus session" });
      }
    }
  });

  app.patch("/api/focus-sessions/:id/complete", async (req, res) => {
    try {
      const { endTime, duration } = req.body;
      const session = await storage.completeFocusSession(
        req.params.id,
        new Date(endTime),
        duration
      );
      if (!session) {
        return res.status(404).json({ error: "Focus session not found" });
      }

      // Award XP for completing a focus session
      const user = await storage.getUser(session.userId);
      if (user) {
        const xpReward = 20;
        await storage.updateUser(user.id, {
          totalXp: user.totalXp + xpReward,
        });
      }

      res.json(session);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete focus session" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const stats = await storage.getProductivityStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch productivity stats" });
    }
  });

  app.get("/api/analytics/category-stats", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const stats = await storage.getCategoryStats(userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category stats" });
    }
  });

  app.get("/api/analytics/heatmap", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : new Date();

      const data = await storage.getHeatmapData(userId, startDate, endDate);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch heatmap data" });
    }
  });

  // Data export
  app.get("/api/export/tasks", async (req, res) => {
    try {
      const userId = req.query.userId as string || "default-user";
      const tasks = await storage.getTasks(userId);
      const format = req.query.format || "json";

      if (format === "csv") {
        const csv = [
          "Title,Description,Priority,Status,Category,Due Date,Created At",
          ...tasks.map(
            (t) =>
              `"${t.title}","${t.description || ""}",${t.priority},"${t.status}","${t.category || ""}","${t.dueDate || ""}","${t.createdAt}"`
          ),
        ].join("\n");

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="tasks.csv"');
        res.send(csv);
      } else {
        res.json(tasks);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to export tasks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
