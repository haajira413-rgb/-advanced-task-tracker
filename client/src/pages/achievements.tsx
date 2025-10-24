import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Lock, Trophy, Zap, Star, Sunrise, Flame, Moon, Target, Crown } from "lucide-react";
import { useAchievements } from "@/hooks/use-achievements";
import { useUser } from "@/hooks/use-user";
import { format } from "date-fns";

const allAchievements = [
  {
    id: "early-bird",
    name: "Early Bird",
    description: "Complete 5 tasks before noon",
    icon: Sunrise,
    xpReward: 50,
    rarity: "common",
    checkUnlocked: (achievements: any[]) =>
      achievements.some((a) => a.badgeName === "Early Bird"),
  },
  {
    id: "streak-master",
    name: "Streak Master",
    description: "Maintain a 7-day streak",
    icon: Flame,
    xpReward: 100,
    rarity: "rare",
    checkUnlocked: (achievements: any[]) =>
      achievements.some((a) => a.badgeName === "Streak Master"),
  },
  {
    id: "night-owl",
    name: "Night Owl",
    description: "Complete 10 tasks after 8 PM",
    icon: Moon,
    xpReward: 75,
    rarity: "uncommon",
    checkUnlocked: (achievements: any[]) =>
      achievements.some((a) => a.badgeName === "Night Owl"),
  },
  {
    id: "productivity-pro",
    name: "Productivity Pro",
    description: "Complete 50 tasks total",
    icon: Zap,
    xpReward: 200,
    rarity: "epic",
    checkUnlocked: (achievements: any[]) =>
      achievements.some((a) => a.badgeName === "Productivity Pro"),
  },
  {
    id: "focus-champion",
    name: "Focus Champion",
    description: "Complete 20 Pomodoro sessions",
    icon: Target,
    xpReward: 150,
    rarity: "rare",
    checkUnlocked: (achievements: any[]) =>
      achievements.some((a) => a.badgeName === "Focus Champion"),
  },
  {
    id: "task-titan",
    name: "Task Titan",
    description: "Complete 100 tasks total",
    icon: Crown,
    xpReward: 500,
    rarity: "legendary",
    checkUnlocked: (achievements: any[]) =>
      achievements.some((a) => a.badgeName === "Task Titan"),
  },
];

const rarityColors = {
  common: { bg: "hsl(var(--muted))", text: "hsl(var(--muted-foreground))", border: "hsl(var(--muted-border))" },
  uncommon: { bg: "hsl(142 76% 45% / 0.1)", text: "hsl(142 76% 45%)", border: "hsl(142 76% 45% / 0.3)" },
  rare: { bg: "hsl(217 91% 60% / 0.1)", text: "hsl(217 91% 60%)", border: "hsl(217 91% 60% / 0.3)" },
  epic: { bg: "hsl(280 65% 55% / 0.1)", text: "hsl(280 65% 55%)", border: "hsl(280 65% 55% / 0.3)" },
  legendary: { bg: "hsl(25 95% 53% / 0.1)", text: "hsl(25 95% 53%)", border: "hsl(25 95% 53% / 0.3)" },
};

export default function Achievements() {
  const { data: achievements = [], isLoading } = useAchievements();
  const { data: user } = useUser();

  const enrichedAchievements = allAchievements.map((ach) => ({
    ...ach,
    unlocked: ach.checkUnlocked(achievements),
  }));

  const unlockedCount = enrichedAchievements.filter((a) => a.unlocked).length;
  const totalXp = enrichedAchievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.xpReward, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
        <Skeleton className="h-20 w-full" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">Unlock badges and track your progress</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unlocked</CardTitle>
            <Trophy className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-unlocked-count">
              {unlockedCount} / {allAchievements.length}
            </div>
            <Progress
              value={(unlockedCount / allAchievements.length) * 100}
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP Earned</CardTitle>
            <Zap className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-xp">
              {totalXp} XP
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From achievements
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Level</CardTitle>
            <Star className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {user?.level || 1}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {user?.totalXp || 0} total XP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {enrichedAchievements.map((achievement) => {
          const rarity = rarityColors[achievement.rarity as keyof typeof rarityColors];
          const isLocked = !achievement.unlocked;

          return (
            <Card
              key={achievement.id}
              className={`hover-elevate relative overflow-hidden ${isLocked ? "opacity-75" : ""}`}
              style={{
                borderColor: rarity.border,
              }}
              data-testid={`achievement-${achievement.id}`}
            >
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-16 w-16 items-center justify-center rounded-lg text-3xl ${
                      isLocked ? "opacity-40" : ""
                    }`}
                    style={{
                      backgroundColor: rarity.bg,
                    }}
                  >
                    {isLocked ? (
                      <Lock className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <achievement.icon className="h-8 w-8" style={{ color: rarity.text }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">{achievement.name}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {achievement.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge
                  className="capitalize"
                  style={{
                    backgroundColor: rarity.bg,
                    color: rarity.text,
                  }}
                >
                  {achievement.rarity}
                </Badge>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reward</span>
                  <Badge variant="secondary">
                    <Zap className="h-3 w-3 mr-1" />
                    +{achievement.xpReward} XP
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Unlocks */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Unlocks</CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements
              .slice(-3)
              .reverse()
              .map((achievement, index) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-3 rounded-md border border-card-border hover-elevate"
                  data-testid={`recent-achievement-${index}`}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{achievement.badgeName}</p>
                    <p className="text-xs text-muted-foreground">
                      Unlocked {format(new Date(achievement.earnedAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <Badge variant="secondary">New!</Badge>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
