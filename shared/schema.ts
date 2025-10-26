export interface Task {
  id: string;
  userId: string;
  title: string;
  description?: string;
  status: string;
  priority: number;
  dueDate?: string;
  category?: string;
  tags?: string[];
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InsertTask {
  title: string;
  description?: string;
  status?: string;
  priority?: number;
  dueDate?: string;
  category?: string;
  tags?: string[];
}

export interface User {
  id: string;
  username: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
}