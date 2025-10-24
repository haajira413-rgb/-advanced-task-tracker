import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { FocusSession, InsertFocusSession } from "@shared/schema";

const DEFAULT_USER_ID = "default-user";

export function useFocusSessions(userId: string = DEFAULT_USER_ID) {
  return useQuery<FocusSession[]>({
    queryKey: ["/api/focus-sessions", { userId }],
  });
}

export function useCreateFocusSession() {
  return useMutation({
    mutationFn: async (data: InsertFocusSession & { userId?: string }) => {
      return await apiRequest("POST", "/api/focus-sessions", {
        ...data,
        userId: data.userId || DEFAULT_USER_ID,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/focus-sessions"] });
    },
  });
}

export function useCompleteFocusSession() {
  return useMutation({
    mutationFn: async ({ id, endTime, duration }: { id: string; endTime: Date; duration: number }) => {
      return await apiRequest("PATCH", `/api/focus-sessions/${id}/complete`, {
        endTime: endTime.toISOString(),
        duration,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/focus-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });
}
