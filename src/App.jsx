import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import About from '@/pages/About';
import VTuber from '@/pages/VTuber';
import VoiceActing from '@/pages/VoiceActing';
import Commissions from '@/pages/Commissions';
import Merch from '@/pages/Merch';
import Sponsors from '@/pages/Sponsors';
import InterviewSignup from '@/pages/InterviewSignup';
import SpicyVoiceActing from '@/pages/SpicyVoiceActing';
import Contact from '@/pages/Contact';
import Terms from '@/pages/Terms';
import ReviewApproval from '@/pages/ReviewApproval';
import PlannerLanding from '@/pages/PlannerLanding';
import PlannerProtectedRoute from '@/components/planner/PlannerProtectedRoute';
import PlannerShell from '@/components/planner/PlannerShell';
import PlannerDashboard from '@/pages/PlannerDashboard';
import PlannerTasks from '@/pages/PlannerTasks';
import PlannerContent from '@/pages/PlannerContent';
import PlannerStreams from '@/pages/PlannerStreams';
import PlannerBrand from '@/pages/PlannerBrand';
import PlannerGrowth from '@/pages/PlannerGrowth';
import PlannerIdeas from '@/pages/PlannerIdeas';
import PlannerCustomize from '@/pages/PlannerCustomize';
import PlannerSettings from '@/pages/PlannerSettings';
import PlannerCalendar from '@/pages/PlannerCalendar';
import PlannerSearch from '@/pages/PlannerSearch';
import PlannerAdmin from '@/pages/PlannerAdmin';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/vtuber" element={<VTuber />} />
        <Route path="/voice-acting" element={<VoiceActing />} />
        <Route path="/commissions" element={<Commissions />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/sponsors" element={<Sponsors />} />
        <Route path="/interview-signup" element={<InterviewSignup />} />
        <Route path="/spicy" element={<SpicyVoiceActing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/review-approval" element={<ReviewApproval />} />
        <Route path="/planner" element={<PlannerLanding />} />
        <Route element={<PlannerProtectedRoute />}>
          <Route element={<PlannerShell />}>
            <Route path="/planner/dashboard" element={<PlannerDashboard />} />
            <Route path="/planner/tasks" element={<PlannerTasks />} />
            <Route path="/planner/calendar" element={<PlannerCalendar />} />
            <Route path="/planner/search" element={<PlannerSearch />} />
            <Route path="/planner/admin" element={<PlannerAdmin />} />
            <Route path="/planner/content" element={<PlannerContent />} />
            <Route path="/planner/streams" element={<PlannerStreams />} />
            <Route path="/planner/brand" element={<PlannerBrand />} />
            <Route path="/planner/growth" element={<PlannerGrowth />} />
            <Route path="/planner/ideas" element={<PlannerIdeas />} />
            <Route path="/planner/customize" element={<PlannerCustomize />} />
            <Route path="/planner/settings" element={<PlannerSettings />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App