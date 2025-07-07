
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { Header } from "@/components/Layout/Header";
import { LoginForm } from "@/components/Login/LoginForm";
import Dashboard from "./pages/Dashboard";
import PointOfSale from "./pages/PointOfSale";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<PointOfSale />} />
              <Route path="/inventory" element={<div className="p-6"><h1 className="text-2xl font-bold">Inventory Management</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/sales" element={<div className="p-6"><h1 className="text-2xl font-bold">Sales History</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reports</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/customers" element={<div className="p-6"><h1 className="text-2xl font-bold">Customer Management</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="/settings" element={<div className="p-6"><h1 className="text-2xl font-bold">Settings</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <StoreProvider>
            <AppContent />
          </StoreProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
