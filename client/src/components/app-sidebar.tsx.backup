import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Trophy,
  Timer,
  Settings,
  Plus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Kanban Board",
    url: "/kanban",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Achievements",
    url: "/achievements",
    icon: Trophy,
  },
  {
    title: "Pomodoro",
    url: "/pomodoro",
    icon: Timer,
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { data: user } = useUser();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <CheckSquare className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">TaskTracker</h2>
            <p className="text-xs text-muted-foreground">Boost Your Productivity</p>
          </div>
        </div>
        <Button
          className="mt-4 w-full"
          data-testid="button-quick-add"
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick Add Task
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(' ', '-')}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 p-3 rounded-md bg-card border border-card-border">
          <Avatar>
            <AvatarFallback>{user?.username?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username || "User"}</p>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Level {user?.level || 1}
              </Badge>
              <span className="text-xs text-muted-foreground">{user?.totalXp || 0} XP</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings" data-testid="link-settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
