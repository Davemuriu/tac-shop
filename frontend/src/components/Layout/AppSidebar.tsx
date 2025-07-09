import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Boxes,
  BarChart2,
  Settings,
  Users,
  FileText,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/pos", label: "Point of Sale", icon: ShoppingCart },
  { to: "/inventory", label: "Inventory", icon: Boxes },
  { to: "/reports", label: "Reports", icon: BarChart2 },
  { to: "/admin", label: "Admin Panel", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/sales", label: "Sales", icon: FileText },
  { to: "/customers", label: "Customers", icon: Users },
];

const AppSidebar: React.FC = () => {
  const navItem = (
    to: string,
    label: string,
    Icon: React.ComponentType<{ className?: string }>
  ) => (
    <NavLink
      to={to}
      key={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-4 py-3 rounded transition ${
          isActive
            ? "bg-muted text-foreground font-semibold"
            : "text-muted-foreground hover:bg-muted"
        }`
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-60 bg-background border-r h-screen p-4 space-y-2">
      <div className="text-xl font-bold mb-4">Tuck Shop</div>
      {navItems.map((item) => navItem(item.to, item.label, item.icon))}
    </aside>
  );
};

export { AppSidebar };
