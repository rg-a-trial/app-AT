import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Indications from "./pages/Indications";
import Territoires from "./pages/Territoires";
import Centres from "./pages/Centres";
import Signaux from "./pages/Signaux";
import Rapports from "./pages/Rapports";
import Timing from "./pages/Timing";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/indications" element={<Indications />} />
          <Route path="/territoires" element={<Territoires />} />
          <Route path="/centres" element={<Centres />} />
          <Route path="/timing" element={<Timing />} />
          <Route path="/signaux" element={<Signaux />} />
          <Route path="/rapports" element={<Rapports />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
