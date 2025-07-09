import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StoreProvider } from "@/contexts/StoreContext";
import { AppSidebar } from "@/components/Layout/AppSidebar";
import { Header } from "@/components/Layout/Header";
import Dashboard from "./pages/Dashboard";
import PointOfSale from "./pages/PointOfSale";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppLayout() {
  return (
    <SidebarProvider>
      {/* Apply the background image here */}
      <div className="min-h-screen w-full bg-[url('/bg-pattern.jpg')] bg-repeat bg-center bg-fixed">
        <div className="min-h-screen flex w-full bg-background/90 backdrop-blur-sm">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pos" element={<PointOfSale />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/sales" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Sales History</h1>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                } />
                <Route path="/customers" element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Customer Management</h1>
                    <p className="text-muted-foreground">Coming soon...</p>
                  </div>
                } />
                <Route path="/settings" element={<Navigate to="/admin" replace />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
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
        <StoreProvider>
          <AppLayout />
        </StoreProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
