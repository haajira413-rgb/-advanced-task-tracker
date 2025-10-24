import { useQuery } from "@tanstack/react-query";
import type { Achievement } from "@shared/schema";

const DEFAULT_USER_ID = "default-user";

export function useAchievements(userId: string = DEFAULT_USER_ID) {
  return useQuery<Achievement[]>({
    queryKey: ["/api/achievements", { userId }],
  });
}
