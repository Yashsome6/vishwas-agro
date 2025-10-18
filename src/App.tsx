import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { RoleProvider } from "./contexts/RoleContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Stock from "./pages/Stock";
import Purchase from "./pages/Purchase";
import Sales from "./pages/Sales";
import Accounting from "./pages/Accounting";
import Staff from "./pages/Staff";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import CustomerPortal from "./pages/CustomerPortal";
import VendorPortal from "./pages/VendorPortal";
import Analytics from "./pages/Analytics";
import Workflows from "./pages/Workflows";
import GSTCompliance from "./pages/GSTCompliance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RoleProvider>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="stock" element={<Stock />} />
                <Route path="purchase" element={<Purchase />} />
                <Route path="sales" element={<Sales />} />
                <Route path="accounting" element={<Accounting />} />
                <Route path="staff" element={<Staff />} />
                <Route path="reports" element={<Reports />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="workflows" element={<Workflows />} />
                <Route path="gst" element={<GSTCompliance />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="customer-portal" element={<CustomerPortal />} />
              <Route path="vendor-portal" element={<VendorPortal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppProvider>
    </RoleProvider>
  </QueryClientProvider>
);

export default App;
