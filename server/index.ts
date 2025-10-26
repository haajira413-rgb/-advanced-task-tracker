import express, { type Request, Response } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from dist/public
const publicPath = path.join(__dirname, "../dist/public");
app.use(express.static(publicPath));

// In-memory storage
let tasks: any[] = [];
let user = {
  id: "default-user",
  username: "User",
  xp: 0,
  level: 1,
  streak: 0,
  lastActive: new Date().toISOString(),
};

// Helper function to calculate level from XP
function calculateLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

// API Routes - Tasks
app.get("/api/tasks", (req, res) => {
  const { status, priority } = req.query;
  let filteredTasks = tasks;
  
  if (status) {
    filteredTasks = filteredTasks.filter(t => t.status === status);
  }
  if (priority) {
    filteredTasks = filteredTasks.filter(t => t.priority === Number(priority));
  }
  
  res.json(filteredTasks);
});

app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: Date.now().toString(),
    userId: req.body.userId || "default-user",
    title: req.body.title,
    description: req.body.description || "",
    status: req.body.status || "todo",
    priority: req.body.priority || 1,
    dueDate: req.body.dueDate,
    category: req.body.category,
    tags: req.body.tags || [],
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  res.json(newTask);
});

app.patch("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const initialLength = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  
  if (tasks.length < initialLength) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.post("/api/tasks/:id/complete", (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === id);
  
  if (index !== -1) {
    tasks[index] = {
      ...tasks[index],
      completed: true,
      completedAt: new Date().toISOString(),
      status: "completed",
      updatedAt: new Date().toISOString(),
    };
    
    // Update user XP and level
    const xpGain = tasks[index].priority * 10;
    user.xp += xpGain;
    user.level = calculateLevel(user.xp);
    user.lastActive = new Date().toISOString();
    
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// API Routes - User
app.get("/api/user", (req, res) => {
  res.json(user);
});

// API Routes - Analytics
app.get("/api/analytics/stats", (req, res) => {
  const stats = {
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    pendingTasks: tasks.filter(t => !t.completed).length,
    todayTasks: tasks.filter(t => {
      const today = new Date().toDateString();
      return new Date(t.createdAt).toDateString() === today;
    }).length,
  };
  res.json(stats);
});

// API Routes - Achievements
app.get("/api/achievements", (req, res) => {
  const achievements = [
    {
      id: "1",
      title: "First Task",
      description: "Complete your first task",
      unlocked: tasks.filter(t => t.completed).length > 0,
    },
    {
      id: "2",
      title: "Task Master",
      description: "Complete 10 tasks",
      unlocked: tasks.filter(t => t.completed).length >= 10,
    },
    {
      id: "3",
      title: "Level Up",
      description: "Reach level 5",
      unlocked: user.level >= 5,
    },
  ];
  res.json(achievements);
});

// Serve React app for all other routes
app.get("*", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("index.html not found. Run 'npm run build' first.");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${publicPath}`);
});