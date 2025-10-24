import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { User } from "@shared/schema";

const DEFAULT_USER_ID = "default-user";

export function useUser(userId: string = DEFAULT_USER_ID) {
  return useQuery<User>({
    queryKey: [`/api/user/${userId}`],
  });
}

export function useUpdateUser() {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      return await apiRequest("PATCH", `/api/user/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${variables.id}`] });
    },
  });
}
