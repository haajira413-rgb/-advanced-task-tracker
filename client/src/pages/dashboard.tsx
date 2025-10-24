import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Clock,
  TrendingUp,
  Flame,
  Award,
  Plus,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { Link } from "wouter";
import { useProductivityStats } from "@/hooks/use-analytics";
import { useTasks, useCompleteTask } from "@/hooks/use-tasks";
import { useUser } from "@/hooks/use-user";
import { useAchievements } from "@/hooks/use-achievements";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useProductivityStats();
  const { data: user, isLoading: userLoading } = useUser();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const { data: achievements = [] } = useAchievements();
  const completeTask = useCompleteTask();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTasks = tasks.filter((t) => {
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate.getTime() === today.getTime() && t.status !== "completed";
  });

  const levelProgress = user ? (user.totalXp % 100) : 0;
  const recentAchievements = achievements.slice(-3).reverse();

  const handleCompleteTask = async (id: string) => {
    await completeTask.mutateAsync(id);
  };

  if (statsLoading || userLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Good Morning! 👋</h1>
        <p className="text-muted-foreground">
          You have {todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""} today
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-streak-days">
              {stats?.streakDays || 0} days
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Keep it going!
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Award className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-level">
              Level {stats?.level || 1}
            </div>
            <Progress value={levelProgress} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {levelProgress} / 100 XP
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-tasks-today">
              {stats?.tasksToday || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {todayTasks.length} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-completion-rate">
              {Math.round(stats?.completionRate || 0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Today's Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Tasks</CardTitle>
                <CardDescription>Focus on what matters most</CardDescription>
              </div>
              <Button size="sm" asChild>
                <Link href="/tasks" data-testid="link-view-all-tasks">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasksLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))
            ) : todayTasks.length > 0 ? (
              todayTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 rounded-md border border-card-border hover-elevate active-elevate-2"
                  data-testid={`task-item-${task.id}`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded border-input cursor-pointer"
                    data-testid={`checkbox-task-${task.id}`}
                    onChange={() => handleCompleteTask(task.id)}
                    disabled={completeTask.isPending}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {task.dueDate && (
                        <Badge variant="secondary" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(task.dueDate), "h:mm a")}
                        </Badge>
                      )}
                      <Badge
                        className="text-xs"
                        style={{
                          backgroundColor:
                            task.priority === 1
                              ? "hsl(0 84% 60% / 0.1)"
                              : task.priority === 2
                              ? "hsl(25 95% 53% / 0.1)"
                              : "hsl(217 91% 60% / 0.1)",
                          color:
                            task.priority === 1
                              ? "hsl(0 84% 60%)"
                              : task.priority === 2
                              ? "hsl(25 95% 53%)"
                              : "hsl(217 91% 60%)",
                        }}
                      >
                        {task.priority === 1 ? "High" : task.priority === 2 ? "Medium" : "Low"} Priority
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tasks due today</p>
                <p className="text-sm mt-1">You're all caught up!</p>
              </div>
            )}

            <Button className="w-full" variant="outline" data-testid="button-add-task" asChild>
              <Link href="/tasks">
                <Plus className="h-4 w-4 mr-2" />
                Add New Task
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Achievements</CardTitle>
                <CardDescription>Celebrate your wins</CardDescription>
              </div>
              <Button size="sm" variant="ghost" asChild>
                <Link href="/achievements" data-testid="link-view-achievements">
                  View All
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAchievements.length > 0 ? (
              recentAchievements.map((achievement, i) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-3 rounded-md bg-accent/50 border border-accent-border"
                  data-testid={`achievement-${i}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary">
                    <Trophy className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{achievement.badgeName}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="secondary">New!</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No achievements yet</p>
                <p className="text-sm mt-1">Complete tasks to unlock badges!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
          <CardDescription>Your productivity at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-medium">{stats?.completedTasks || 0} tasks</span>
              </div>
              <Progress value={stats?.completionRate || 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total XP</span>
                <span className="text-sm font-medium">{stats?.totalXp || 0} XP</span>
              </div>
              <Progress value={(levelProgress / 100) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Achievements</span>
                <span className="text-sm font-medium">{achievements.length} unlocked</span>
              </div>
              <Progress value={(achievements.length / 10) * 100} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
