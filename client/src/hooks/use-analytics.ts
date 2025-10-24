import { useQuery } from "@tanstack/react-query";
import type { ProductivityStats, CategoryStats, HeatmapData } from "@shared/schema";

const DEFAULT_USER_ID = "default-user";

export function useProductivityStats(userId: string = DEFAULT_USER_ID) {
  return useQuery<ProductivityStats>({
    queryKey: ["/api/analytics/stats", { userId }],
  });
}

export function useCategoryStats(userId: string = DEFAULT_USER_ID) {
  return useQuery<CategoryStats[]>({
    queryKey: ["/api/analytics/category-stats", { userId }],
  });
}

export function useHeatmapData(userId: string = DEFAULT_USER_ID) {
  return useQuery<HeatmapData[]>({
    queryKey: ["/api/analytics/heatmap", { userId }],
  });
}
