import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";

// Components
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdminLayout } from "@/components/layout/AdminLayout";

// Public Pages
import Home from "@/pages/Home";
import States from "@/pages/States";
import Cities from "@/pages/Cities";
import Listings from "@/pages/Listings";
import StatePage from "@/pages/StatePage";
import CityPage from "@/pages/CityPage";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import SeoPageView from "@/pages/SeoPageView";
import NotFound from "@/pages/not-found";

// Admin Pages
import Login from "@/pages/admin/Login";
import Dashboard from "@/pages/admin/Dashboard";
import ManageStates from "@/pages/admin/ManageStates";
import ManageCities from "@/pages/admin/ManageCities";
import ManageListings from "@/pages/admin/ManageListings";
import SeoManager from "@/pages/admin/SeoManager";
import Settings from "@/pages/admin/Settings";

function Redirect({ to }: { to: string }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={() => <Redirect to="/admin/dashboard" />} />
        <Route path="/admin/dashboard" component={Dashboard} />
        <Route path="/admin/states" component={ManageStates} />
        <Route path="/admin/cities" component={ManageCities} />
        <Route path="/admin/listings" component={ManageListings} />
        <Route path="/admin/seo" component={SeoManager} />
        <Route path="/admin/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin Login - No layout */}
      <Route path="/admin/login" component={Login} />

      {/* All /admin/* routes wrapped in AdminLayout */}
      <Route path="/admin" component={AdminRouter} />
      <Route path="/admin/:path+" component={AdminRouter} />

      {/* Public routes with Layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/states" component={States} />
            <Route path="/state/:slug" component={StatePage} />
            <Route path="/cities" component={Cities} />
            <Route path="/city/:slug" component={CityPage} />
            <Route path="/listings" component={Listings} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route path="/terms" component={Terms} />

            {/* MUST BE LAST — SEO catch-all */}
            <Route path="/:seoSlug" component={SeoPageView} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
