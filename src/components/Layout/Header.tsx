
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Sun, Moon, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export function Header() {
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const canGoBack = window.history.length > 1;
  const isNotHome = location.pathname !== '/';

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
            <h1 className="font-semibold text-foreground">TAC Shop Management</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
    </header>
  );
}
