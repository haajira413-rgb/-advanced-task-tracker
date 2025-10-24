import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Clock,
  Coffee,
  CheckCircle2,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFocusSessions, useCreateFocusSession, useCompleteFocusSession } from "@/hooks/use-focus-sessions";
import { format } from "date-fns";

export default function Pomodoro() {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [sessionType, setSessionType] = useState<"work" | "break">("work");
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const { data: sessions = [], isLoading } = useFocusSessions();
  const createSession = useCreateFocusSession();
  const completeSession = useCompleteFocusSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = sessionType === "work" ? focusDuration * 60 : breakDuration * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.createdAt);
    const today = new Date();
    sessionDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return sessionDate.getTime() === today.getTime();
  });

  const completedToday = todaySessions.filter((s) => s.duration !== null).length;
  const totalFocusTime = todaySessions
    .filter((s) => s.duration)
    .reduce((sum, s) => sum + (s.duration || 0), 0);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleTimer = async () => {
    if (!isRunning && !currentSessionId) {
      // Start new session
      const session = await createSession.mutateAsync({
        taskId: null,
        startTime: new Date(),
        endTime: null,
        duration: null,
        sessionType: sessionType === "work" ? "pomodoro" : "deep_focus",
      });
      setCurrentSessionId(session.id);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionType === "work" ? focusDuration * 60 : breakDuration * 60);
    setCurrentSessionId(null);
  };

  const handleSessionComplete = async () => {
    setIsRunning(false);
    if (currentSessionId) {
      await completeSession.mutateAsync({
        id: currentSessionId,
        endTime: new Date(),
        duration: totalTime,
      });
    }
    // Auto switch to break or work
    if (sessionType === "work") {
      setSessionType("break");
      setTimeLeft(breakDuration * 60);
    } else {
      setSessionType("work");
      setTimeLeft(focusDuration * 60);
    }
    setCurrentSessionId(null);
  };

  const skipSession = () => {
    setIsRunning(false);
    setCurrentSessionId(null);
    if (sessionType === "work") {
      setSessionType("break");
      setTimeLeft(breakDuration * 60);
    } else {
      setSessionType("work");
      setTimeLeft(focusDuration * 60);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Stay focused and productive</p>
        </div>
      </div>

      {/* Timer Display */}
      <Card className="border-2">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Session Type Badge */}
            <Badge
              variant={sessionType === "work" ? "default" : "secondary"}
              className="text-sm px-4 py-1.5"
            >
              {sessionType === "work" ? (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Focus Session
                </>
              ) : (
                <>
                  <Coffee className="h-4 w-4 mr-2" />
                  Break Time
                </>
              )}
            </Badge>

            {/* Circular Progress Ring */}
            <div className="relative">
              <svg className="w-64 h-64 md:w-80 md:h-80 -rotate-90" viewBox="0 0 200 200">
                {/* Background Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                {/* Progress Circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>

              {/* Time Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div
                    className="text-5xl md:text-6xl font-mono font-bold tracking-tight"
                    data-testid="text-timer"
                  >
                    {formatTime(timeLeft)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {sessionType === "work" ? "Stay focused" : "Take a break"}
                  </p>
                </div>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              <Button
                size="lg"
                className="h-14 w-14 rounded-full"
                onClick={toggleTimer}
                data-testid="button-toggle-timer"
              >
                {isRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-full"
                onClick={resetTimer}
                data-testid="button-reset-timer"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 w-14 rounded-full"
                onClick={skipSession}
                data-testid="button-skip-session"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Session Counter */}
            <div className="flex items-center gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i < completedToday % 4 ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings & Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Timer Settings</CardTitle>
            <CardDescription>Customize your Pomodoro sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Focus Duration</label>
              <Select
                value={focusDuration.toString()}
                onValueChange={(val) => {
                  setFocusDuration(parseInt(val));
                  if (sessionType === "work" && !isRunning) {
                    setTimeLeft(parseInt(val) * 60);
                  }
                }}
              >
                <SelectTrigger data-testid="select-focus-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="25">25 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Break Duration</label>
              <Select
                value={breakDuration.toString()}
                onValueChange={(val) => {
                  setBreakDuration(parseInt(val));
                  if (sessionType === "break" && !isRunning) {
                    setTimeLeft(parseInt(val) * 60);
                  }
                }}
              >
                <SelectTrigger data-testid="select-break-duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Today's Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Progress</CardTitle>
            <CardDescription>Your focus session stats</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="font-medium">Completed Sessions</span>
              </div>
              <span className="text-2xl font-bold" data-testid="text-completed-sessions">
                {completedToday}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-md bg-accent/50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Focus Time</span>
              </div>
              <span className="text-2xl font-bold">
                {Math.round(totalFocusTime / 60)}m
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Daily Goal</span>
                <span className="font-medium">{completedToday} / 8 sessions</span>
              </div>
              <Progress value={(completedToday / 8) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sessions</CardTitle>
          <CardDescription>Your focus history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {todaySessions.slice(-3).reverse().map((session, i) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 rounded-md border border-card-border hover-elevate"
                data-testid={`session-${i}`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Focus Session #{sessions.indexOf(session) + 1}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.duration ? `${Math.round(session.duration / 60)} minutes` : "In progress"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={session.duration ? "secondary" : "outline"}>
                    {session.duration ? "Completed" : "Active"}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(session.createdAt), "h:mm a")}
                  </p>
                </div>
              </div>
            ))}
            {todaySessions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No sessions today. Start your first focus session!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
