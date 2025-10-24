import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Task, InsertTask } from "@shared/schema";

const DEFAULT_USER_ID = "default-user";

export function useTasks(status?: string, priority?: number) {
  return useQuery<Task[]>({
    queryKey: status
      ? ["/api/tasks", { status }]
      : priority
      ? ["/api/tasks", { priority }]
      : ["/api/tasks"],
  });
}

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: [`/api/tasks/${id}`],
    enabled: !!id,
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: async (data: InsertTask & { userId?: string }) => {
      return await apiRequest("POST", "/api/tasks", {
        ...data,
        userId: data.userId || DEFAULT_USER_ID,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}

export function useUpdateTask() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      return await apiRequest("PATCH", `/api/tasks/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: [`/api/tasks/${variables.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
    },
  });
}

export function useCompleteTask() {
  return useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/tasks/${id}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/achievements"] });
    },
  });
}
