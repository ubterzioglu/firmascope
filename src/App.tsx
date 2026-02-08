import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import FirmaPill from "@/components/FirmaPill";
import Index from "./pages/Index";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Legal from "./pages/Legal";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import SuggestCompany from "./pages/SuggestCompany";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FirmaPill />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sirketler" element={<Companies />} />
            <Route path="/sirket/:slug" element={<CompanyDetail />} />
            <Route path="/yasal" element={<Legal />} />
            <Route path="/giris" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/sirket-oner" element={<SuggestCompany />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
