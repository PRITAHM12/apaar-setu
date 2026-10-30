import React, { useEffect } from 'react';
import { AuthRBACProvider, useAuthRBAC } from './context/AuthRBACContext';
import { TopNavbar } from './components/layout/TopNavbar';
import { LandingPage } from './components/views/LandingPage';
import { LoginGateway } from './components/auth/LoginGateway';
import { NodalOfficerView } from './components/views/NodalOfficerView';
import { CouncilAdminView } from './components/views/CouncilAdminView';
import { VerifierForensicView } from './components/views/VerifierForensicView';
import { StudentPassportView } from './components/views/StudentPassportView';

const ProtectedRouteGuard: React.FC = () => {
  const { isAuthenticated, activeScreen, activeRole, setActiveScreen } = useAuthRBAC();

  // If unauthenticated and trying to access any protected dashboard, redirect to Landing
  useEffect(() => {
    if (!isAuthenticated && activeScreen !== 'LANDING' && activeScreen !== 'SCREEN_OAUTH') {
      setActiveScreen('LANDING');
    }
  }, [isAuthenticated, activeScreen, setActiveScreen]);

  // Public unauthenticated routing
  if (!isAuthenticated) {
    if (activeScreen === 'SCREEN_OAUTH') {
      return <LoginGateway />;
    }
    return <LandingPage />;
  }

  // Authenticated protected views strictly guarded by user's active session & role
  switch (activeScreen) {
    case 'TAB_STUDENT':
      return <StudentPassportView />;
    case 'TAB_COLLEGE':
      return <NodalOfficerView />;
    case 'TAB_VERIFIER':
      return <VerifierForensicView />;
    case 'TAB_AICTE':
      return <CouncilAdminView />;
    case 'SCREEN_OAUTH':
      return <LoginGateway />;
    case 'LANDING':
      return <LandingPage />;
    default:
      // Fallback to the dashboard authorized for the authenticated user's role
      if (activeRole === 'ROLE_INST_NODAL') return <NodalOfficerView />;
      if (activeRole === 'ROLE_VERIFIER') return <VerifierForensicView />;
      if (activeRole === 'ROLE_COUNCIL_ADMIN') return <CouncilAdminView />;
      return <StudentPassportView />;
  }
};

const MainApplication: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      <TopNavbar />
      <main className="w-full flex-1">
        <ProtectedRouteGuard />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthRBACProvider>
      <MainApplication />
    </AuthRBACProvider>
  );
};

export default App;
