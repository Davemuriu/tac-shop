
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Sun, Moon, ArrowLeft, Users, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { UserSwitcher } from "@/components/Auth/UserSwitcher";

export function Header() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const canGoBack = window.history.length > 1;
  const isNotHome = location.pathname !== '/';

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-tucktical-gold text-tucktical-dark';
      case 'manager': return 'bg-tucktical-secondary text-white';
      case 'cashier': return 'bg-tucktical-accent text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-8 w-8" />
          
          {(canGoBack && isNotHome) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          )}
          
          <div className="hidden md:block">
            <h1 className="font-semibold text-foreground">Tuck Shop Management</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex items-center gap-2 mr-4">
              <div className="text-right">
                <div className="text-sm font-medium text-foreground">{user.name}</div>
                <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                  {user.role.toUpperCase()}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserSwitcher(true)}
                className="h-8 w-8 p-0"
              >
                <Users className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-8 w-8 p-0"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          
          {user && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          )}
        </div>
      </div>
      
      {showUserSwitcher && (
        <UserSwitcher onClose={() => setShowUserSwitcher(false)} />
      )}
    </header>
  );
}
