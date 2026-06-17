import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import FirmaPill from "@/components/FirmaPill";
import ClarityTracker from "@/components/ClarityTracker";
import Index from "./pages/Index";
import Companies from "./pages/Companies";
import CompanyDetail from "./pages/CompanyDetail";
import Legal from "./pages/Legal";
import Auth from "./pages/Auth";
import CompanyAdmin from "./pages/CompanyAdmin";
import SuggestCompany from "./pages/SuggestCompany";
import NotFound from "./pages/NotFound";
import TaxonomyPage from "./pages/TaxonomyPage";
import Profile from "./pages/Profile";
import Feed from "./pages/Feed";
import AdminLayout from "./layouts/AdminLayout";
import AdminAnnouncements from "./components/AdminAnnouncements";
import AdminReports from "./components/AdminReports";
import AdminPosts from "./components/AdminPosts";
import AdminSuggestions from "./pages/admin/AdminSuggestions";
import AdminClaims from "./pages/admin/AdminClaims";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminSalaries from "./pages/admin/AdminSalaries";
import AdminInterviews from "./pages/admin/AdminInterviews";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminScrapeJobs from "./pages/admin/AdminScrapeJobs";
import AdminScrapeJobDetail from "./pages/admin/AdminScrapeJobDetail";
import AdminImports from "./pages/admin/AdminImports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ClarityTracker />
          <FirmaPill />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/sirketler" element={<Companies />} />
            <Route path="/sirket/:slug" element={<CompanyDetail />} />
            <Route path="/sektor/:slug" element={<TaxonomyPage mode="sector" />} />
            <Route path="/sehir/:slug" element={<TaxonomyPage mode="city" />} />
            <Route path="/yasal" element={<Legal />} />
            <Route path="/giris" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminAnnouncements />} />
              <Route path="suggestions" element={<AdminSuggestions />} />
              <Route path="claims" element={<AdminClaims />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="salaries" element={<AdminSalaries />} />
              <Route path="interviews" element={<AdminInterviews />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="scrape" element={<AdminScrapeJobs />} />
              <Route path="scrape/:id" element={<AdminScrapeJobDetail />} />
              <Route path="imports" element={<AdminImports />} />
            </Route>
            <Route path="/sirket-yonetimi" element={<CompanyAdmin />} />
            <Route path="/sirket-oner" element={<SuggestCompany />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/akis" element={<Feed />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
