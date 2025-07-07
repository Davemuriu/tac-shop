
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
  Shield
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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
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
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  const filteredItems = navigationItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <Sidebar
      className={`${isCollapsed ? "w-14" : "w-64"} border-r border-border bg-card`}
      collapsible="offcanvas"
    >
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            {!isCollapsed && (
              <span className="font-bold text-lg">TAC SHOP</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'}
                      className={getNavCls}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {user && !isCollapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              <div className="font-medium">{user.name}</div>
              <div className="capitalize">{user.role}</div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
