import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, GripVertical, Clock, Tag } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { format } from "date-fns";

const columns = [
  { id: "pending", title: "To Do", status: "pending" },
  { id: "in_progress", title: "In Progress", status: "in_progress" },
  { id: "review", title: "Review", status: "in_progress" },
  { id: "completed", title: "Done", status: "completed" },
];

const priorityColors = {
  1: { bg: "hsl(0 84% 60% / 0.1)", text: "hsl(0 84% 60%)", label: "High" },
  2: { bg: "hsl(25 95% 53% / 0.1)", text: "hsl(25 95% 53%)", label: "Medium" },
  3: { bg: "hsl(217 91% 60% / 0.1)", text: "hsl(217 91% 60%)", label: "Low" },
};

export default function Kanban() {
  const { data: allTasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    await updateTask.mutateAsync({
      id: taskId,
      data: { status: newStatus },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 h-full">
        <Skeleton className="h-20 w-full" />
        <div className="flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-96 w-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-muted-foreground">Visualize and manage your workflow</p>
        </div>
      </div>

      {/* Kanban Board */}
      <ScrollArea className="flex-1">
        <div className="flex gap-4 pb-4">
          {columns.map((column) => {
            const columnTasks = allTasks.filter((t) => {
              if (column.id === "review") {
                return t.status === "in_progress" && t.tags?.includes("review");
              }
              return t.status === column.status;
            });

            return (
              <div key={column.id} className="flex-shrink-0 w-80" data-testid={`column-${column.id}`}>
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base font-semibold">
                        {column.title}
                      </CardTitle>
                      <Badge variant="secondary" className="rounded-full">
                        {columnTasks.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3 pt-0">
                    {columnTasks.map((task) => {
                      const priorityStyle = priorityColors[task.priority as keyof typeof priorityColors];
                      return (
                        <Card
                          key={task.id}
                          className="hover-elevate active-elevate-2 cursor-move relative overflow-hidden"
                          data-testid={`task-${task.id}`}
                        >
                          <div
                            className="absolute left-0 top-0 bottom-0 w-1"
                            style={{ backgroundColor: priorityStyle.text }}
                          />
                          <CardContent className="p-3 pl-4">
                            <div className="flex items-start gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0 space-y-2">
                                <h4 className="font-medium text-sm leading-tight">
                                  {task.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2">
                                  <Badge
                                    className="text-xs"
                                    style={{
                                      backgroundColor: priorityStyle.bg,
                                      color: priorityStyle.text,
                                    }}
                                  >
                                    {priorityStyle.label}
                                  </Badge>
                                  {task.category && (
                                    <Badge variant="secondary" className="text-xs">
                                      <Tag className="h-3 w-3 mr-1" />
                                      {task.category}
                                    </Badge>
                                  )}
                                  {task.dueDate && (
                                    <Badge variant="outline" className="text-xs">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {format(new Date(task.dueDate), "MMM d")}
                                    </Badge>
                                  )}
                                </div>
                                {/* Quick Status Change Buttons */}
                                {column.id !== "completed" && (
                                  <div className="flex gap-1">
                                    {column.id === "pending" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-7"
                                        onClick={() => handleStatusChange(task.id, "in_progress")}
                                      >
                                        Start
                                      </Button>
                                    )}
                                    {column.id === "in_progress" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-xs h-7"
                                        onClick={() => handleStatusChange(task.id, "completed")}
                                      >
                                        Complete
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-muted-foreground"
                      data-testid={`button-add-task-${column.id}`}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add task
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
