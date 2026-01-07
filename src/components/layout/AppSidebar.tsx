import { 
  Home, 
  FileText, 
  MapPin, 
  Building2, 
  Clock, 
  TrendingUp, 
  Shield,
  LogOut,
  ChevronLeft
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const navigationItems = [
  { title: "Vue d'ensemble", url: "/", icon: Home },
  { title: "Pathologies", url: "/indications", icon: FileText },
  { title: "Territoires", url: "/territoires", icon: MapPin },
  { title: "Centres & activation", url: "/centres", icon: Building2 },
  { title: "Recrutement", url: "/timing", icon: Clock },
  { title: "Signaux concurrentiels", url: "/signaux", icon: TrendingUp },
];

const adminItems = [
  { title: "Gestion des accès", url: "/admin", icon: Shield },
];

interface AppSidebarProps {
  userRole?: 'viewer' | 'admin' | 'internal';
}

export function AppSidebar({ userRole = 'viewer' }: AppSidebarProps) {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {!collapsed && (
            <div className="flex items-center gap-3 animate-fade-in">
              {/* Structure moléculaire orange */}
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                className="shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff8c42" />
                    <stop offset="50%" stopColor="#ff6b35" />
                    <stop offset="100%" stopColor="#ff4500" />
                  </linearGradient>
                </defs>
                {/* Cercle supérieur gauche */}
                <circle cx="12" cy="10" r="6" fill="url(#orangeGradient)" />
                {/* Forme centrale allongée */}
                <ellipse cx="18" cy="20" rx="8" ry="4" fill="url(#orangeGradient)" />
                {/* Cercle inférieur gauche */}
                <circle cx="10" cy="28" r="5" fill="url(#orangeGradient)" />
                {/* Connexions */}
                <path
                  d="M 12 10 Q 15 15 18 20 Q 15 25 10 28"
                  stroke="url(#orangeGradient)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M 18 20 L 24 20"
                  stroke="url(#orangeGradient)"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </svg>
              {/* Texte "access trial" */}
              <span className="font-display font-semibold text-white text-lg tracking-tight">
                access tria<span className="relative">l<span className="absolute -top-1 left-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></span></span>
              </span>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center mx-auto">
              <svg
                width="32"
                height="32"
                viewBox="0 0 40 40"
                className="shrink-0"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="orangeGradientCollapsed" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff8c42" />
                    <stop offset="50%" stopColor="#ff6b35" />
                    <stop offset="100%" stopColor="#ff4500" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="10" r="6" fill="url(#orangeGradientCollapsed)" />
                <ellipse cx="18" cy="20" rx="8" ry="4" fill="url(#orangeGradientCollapsed)" />
                <circle cx="10" cy="28" r="5" fill="url(#orangeGradientCollapsed)" />
                <path
                  d="M 12 10 Q 15 15 18 20 Q 15 25 10 28"
                  stroke="url(#orangeGradientCollapsed)"
                  strokeWidth="2"
                  fill="none"
                  opacity="0.6"
                />
                <path
                  d="M 18 20 L 24 20"
                  stroke="url(#orangeGradientCollapsed)"
                  strokeWidth="2"
                  opacity="0.6"
                />
              </svg>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url)}
                        className={cn(
                          "transition-all duration-200 rounded-lg",
                          isActive(item.url) 
                            ? "bg-orange-500/30 text-white" 
                            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                        )}
                      >
                        <NavLink to={item.url} className="flex items-center gap-3">
                          <item.icon className={cn(
                            "h-5 w-5 shrink-0",
                            isActive(item.url) ? "text-orange-400" : ""
                          )} />
                          <span className="truncate">{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" className="bg-secondary text-secondary-foreground">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(userRole === 'admin' || userRole === 'internal') && (
          <SidebarGroup className="mt-6">
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive(item.url)}
                          className={cn(
                            "transition-all duration-200 rounded-lg",
                            isActive(item.url) 
                              ? "bg-orange-500/30 text-white" 
                              : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          )}
                        >
                          <NavLink to={item.url} className="flex items-center gap-3">
                            <item.icon className={cn(
                              "h-5 w-5 shrink-0",
                              isActive(item.url) ? "text-orange-400" : ""
                            )} />
                            <span className="truncate">{item.title}</span>
                          </NavLink>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      {collapsed && (
                        <TooltipContent side="right" className="bg-secondary text-secondary-foreground">
                          {item.title}
                        </TooltipContent>
                      )}
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarMenuButton className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="truncate">Déconnexion</span>
                </SidebarMenuButton>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="bg-secondary text-secondary-foreground">
                  Déconnexion
                </TooltipContent>
              )}
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
