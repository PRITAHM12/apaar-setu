import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { TopNavbar } from './components/TopNavbar';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';

// ============================================================================
// ROLE-BASED ROUTING ARCHITECTURE (PROTECTED ROUTES)
// ============================================================================
const ProtectedRouteGuard = () => {
  const { isAuthenticated, role } = useAuth();

  // 1. Unauthenticated users are routed directly to the Login Gateway
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // 2. Role-based dashboard dispatch
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNavbar />
      <main className="flex-1">
        {role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRouteGuard />
    </AuthProvider>
  );
}
