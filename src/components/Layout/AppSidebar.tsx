
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Home,
  Receipt,
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
  useSidebar,
} from "@/components/ui/sidebar";
import { TacLogo } from "@/components/ui/logo";
import { useAuth } from "@/contexts/AuthContext";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home, roles: ['admin', 'manager', 'cashier'] },
  { title: "Point of Sale", url: "/pos", icon: ShoppingCart, roles: ['admin', 'manager', 'cashier'] },
  { title: "Inventory", url: "/inventory", icon: Package, roles: ['admin', 'manager'] },
  { title: "Sales", url: "/sales", icon: Receipt, roles: ['admin', 'manager'] },
  { title: "Reports", url: "/reports", icon: BarChart3, roles: ['admin', 'manager'] },
  { title: "Customers", url: "/customers", icon: Users, roles: ['admin', 'manager'] },
  { title: "Settings", url: "/settings", icon: Settings, roles: ['admin'] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { user } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground hover:text-sidebar-accent-foreground";

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r border-sidebar-border bg-sidebar`}
      collapsible="offcanvas"
    >
      <SidebarContent>
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <TacLogo size="md" className="text-tactical-gold flex-shrink-0" />
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="font-bold text-lg text-sidebar-foreground block truncate">TAC SHOP</span>
                <span className="text-xs text-sidebar-foreground/70 block truncate">Management System</span>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className={`px-2 mb-2 text-sidebar-foreground/70 ${isCollapsed ? 'sr-only' : ''}`}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className={getNavCls}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span className="ml-3 truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && !isCollapsed && (
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="text-sm text-sidebar-foreground/70">
              <div className="font-medium text-sidebar-foreground truncate">{user.name}</div>
              <div className="capitalize text-tactical-accent truncate">{user.role}</div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
