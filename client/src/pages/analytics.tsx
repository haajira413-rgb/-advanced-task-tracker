import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Clock,
  Target,
  Award,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useProductivityStats, useCategoryStats, useHeatmapData } from "@/hooks/use-analytics";
import { useTasks } from "@/hooks/use-tasks";

export default function Analytics() {
  const { data: stats, isLoading: statsLoading } = useProductivityStats();
  const { data: categoryData = [], isLoading: categoryLoading } = useCategoryStats();
  const { data: heatmapRawData = [], isLoading: heatmapLoading } = useHeatmapData();
  const { data: tasks = [] } = useTasks();

  // Generate heatmap grid for last 12 weeks
  const weeks = 12;
  const days = 7;
  const today = new Date();
  const heatmapData = Array.from({ length: weeks }, (_, weekIndex) =>
    Array.from({ length: days }, (_, dayIndex) => {
      const date = new Date(today);
      date.setDate(date.getDate() - ((weeks - weekIndex - 1) * 7 + (days - dayIndex - 1)));
      const dateStr = date.toISOString().split("T")[0];
      const dataPoint = heatmapRawData.find((d) => d.date === dateStr);
      return {
        date: dateStr,
        count: dataPoint?.count || 0,
      };
    })
  );

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "hsl(var(--muted))";
    if (count <= 2) return "hsl(142 76% 55% / 0.3)";
    if (count <= 4) return "hsl(142 76% 45% / 0.6)";
    if (count <= 6) return "hsl(142 76% 40%)";
    return "hsl(142 76% 30%)";
  };

  const categoryColors = [
    "hsl(217 91% 60%)",
    "hsl(280 65% 55%)",
    "hsl(142 76% 45%)",
    "hsl(25 95% 53%)",
  ];

  const totalTasks = categoryData.reduce((sum, cat) => sum + cat.count, 0);

  // Calculate weekly completion trends
  const weeklyTrends = Array.from({ length: 4 }, (_, weekIndex) => {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - ((4 - weekIndex) * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekTasks = tasks.filter((t) => {
      const taskDate = new Date(t.createdAt);
      return taskDate >= weekStart && taskDate < weekEnd;
    });

    const completed = weekTasks.filter((t) => t.status === "completed").length;

    return {
      week: `Week ${weekIndex + 1}`,
      completed,
      total: weekTasks.length,
    };
  });

  if (statsLoading) {
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Track your productivity and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedTasks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(stats?.completionRate || 0)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.avgCompletionTime ? `${stats.avgCompletionTime}m` : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per task average
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalXp || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Level {stats?.level || 1}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Heatmap */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <div>
              <CardTitle>Productivity Heatmap</CardTitle>
              <CardDescription>Your activity over the past {weeks} weeks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {heatmapLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <div className="space-y-3">
              <div className="flex gap-1 text-xs text-muted-foreground pl-8">
                {["Mon", "Wed", "Fri"].map((day, i) => (
                  <div key={day} className="w-[14px]" style={{ marginLeft: i === 0 ? 0 : "14px" }}>
                    {day}
                  </div>
                ))}
              </div>
              <div className="flex gap-1">
                <div className="flex flex-col gap-1 text-xs text-muted-foreground justify-around pr-2">
                  <div>Sun</div>
                  <div>Tue</div>
                  <div>Thu</div>
                  <div>Sat</div>
                </div>
                {heatmapData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className="h-3 w-3 rounded-sm hover:ring-2 hover:ring-ring transition-all cursor-pointer"
                        style={{ backgroundColor: getHeatmapColor(day.count) }}
                        title={`${day.date}: ${day.count} tasks`}
                        data-testid={`heatmap-${weekIndex}-${dayIndex}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="h-3 w-3 rounded-sm"
                      style={{ backgroundColor: getHeatmapColor(level * 2) }}
                    />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown & Completion Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Tasks by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {categoryLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16" />
              ))
            ) : categoryData.length > 0 ? (
              categoryData.map((category, index) => {
                const percentage = (category.count / totalTasks) * 100;
                const color = categoryColors[index % categoryColors.length];
                return (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {category.count} ({Math.round(percentage)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No category data available
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completion Trends</CardTitle>
            <CardDescription>Weekly task completion over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyTrends.map((week) => {
                const rate = week.total > 0 ? (week.completed / week.total) * 100 : 0;
                return (
                  <div key={week.week} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{week.week}</span>
                      <span className="text-muted-foreground">
                        {week.completed}/{week.total} ({Math.round(rate)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-chart-1 rounded-full transition-all"
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
