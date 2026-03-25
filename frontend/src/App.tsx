import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppHeader } from "@/components/AppHeader";
import { RepoProvider } from "@/contexts/RepoContext";
import WelcomePage from "./pages/WelcomePage.tsx";
import Index from "./pages/Index.tsx";
import StructurePage from "./pages/StructurePage.tsx";
import InsightsPage from "./pages/InsightsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <RepoProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppHeader />
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/explore" element={<Index />} />
            <Route path="/structure" element={<StructurePage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </RepoProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
