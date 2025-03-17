import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ThemeProvider } from "./hooks/use-theme";
import { AudioProvider } from "./hooks/use-audio";
import { MainLayout } from "@/components/layout/main-layout";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import BillReaderPage from "@/pages/bill-reader-page";
import ChatPage from "@/pages/chat-page";
import DashboardPage from "@/pages/dashboard-page";
import SettingsPage from "@/pages/settings-page";
import ExpensesPage from "@/pages/expenses-page";
import DreamsPage from "@/pages/dreams-page";
import SimulatorPage from "@/pages/simulator-page";
import InvestmentsPage from "@/pages/investments-page";
import WalletPage from "@/pages/wallet-page";
import GamesPage from "@/pages/games-page";
import MusicPage from "@/pages/music-page";
import NewsPage from "@/pages/news-page";
import PartnersPage from "@/pages/partners-page";
import ContactPage from "@/pages/contact-page";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/" component={() => <ProtectedRoute path="/" component={HomePage} />} />
        <Route path="/expenses" component={() => <ProtectedRoute path="/expenses" component={ExpensesPage} />} />
        <Route path="/dreams" component={() => <ProtectedRoute path="/dreams" component={DreamsPage} />} />
        <Route path="/simulator" component={() => <ProtectedRoute path="/simulator" component={SimulatorPage} />} />
        <Route path="/investments" component={() => <ProtectedRoute path="/investments" component={InvestmentsPage} />} />
        <Route path="/wallet" component={() => <ProtectedRoute path="/wallet" component={WalletPage} />} />
        <Route path="/bill-reader" component={() => <ProtectedRoute path="/bill-reader" component={BillReaderPage} />} />
        <Route path="/chat" component={() => <ProtectedRoute path="/chat" component={ChatPage} />} />
        <Route path="/dashboard" component={() => <ProtectedRoute path="/dashboard" component={DashboardPage} />} />
        <Route path="/settings" component={() => <ProtectedRoute path="/settings" component={SettingsPage} />} />
        <Route path="/games" component={() => <ProtectedRoute path="/games" component={GamesPage} />} />
        <Route path="/music" component={() => <ProtectedRoute path="/music" component={MusicPage} />} />
        <Route path="/news" component={() => <ProtectedRoute path="/news" component={NewsPage} />} />
        <Route path="/partners" component={() => <ProtectedRoute path="/partners" component={PartnersPage} />} />
        <Route path="/contact" component={() => <ProtectedRoute path="/contact" component={ContactPage} />} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AudioProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Router />
              <Toaster />
            </div>
          </AuthProvider>
        </AudioProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;