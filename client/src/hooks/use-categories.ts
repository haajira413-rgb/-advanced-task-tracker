import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Category, InsertCategory } from "@shared/schema";

const DEFAULT_USER_ID = "default-user";

export function useCategories(userId: string = DEFAULT_USER_ID) {
  return useQuery<Category[]>({
    queryKey: ["/api/categories", { userId }],
  });
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: async (data: InsertCategory & { userId?: string }) => {
      return await apiRequest("POST", "/api/categories", {
        ...data,
        userId: data.userId || DEFAULT_USER_ID,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
    },
  });
}
