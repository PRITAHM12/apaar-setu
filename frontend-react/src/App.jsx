import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginScreen } from './components/LoginScreen';
import { TopNavbar } from './components/TopNavbar';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';
import { VerifierDashboard } from './components/VerifierDashboard';

// ============================================================================
// ROLE-BASED ROUTING ARCHITECTURE (STRICT 4-ROLE RBAC DISPATCH)
// Exact roles documented in RBAC.MD & database/schema.sql:
// - ROLE_INST_NODAL    -> Institute Nodal Hub (Intake Quota & Audit Ledger)
// - ROLE_COUNCIL_ADMIN -> National Council Hub (State Analytics & Anomaly Hub)
// - ROLE_STUDENT       -> Student Academic Passport (W3C QR & DPDP Consent Inbox)
// - ROLE_VERIFIER      -> Corporate HR / BGV Verification Console
// ============================================================================
const ProtectedRouteGuard = () => {
  const { isAuthenticated, role } = useAuth();

  // 1. Unauthenticated users are routed directly to the Login Gateway
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // 2. Strict Role-to-Dashboard Dispatching
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <TopNavbar />
      <main className="flex-1">
        {role === 'ROLE_INST_NODAL' || role === 'ROLE_COUNCIL_ADMIN' ? (
          <AdminDashboard />
        ) : role === 'ROLE_VERIFIER' ? (
          <VerifierDashboard />
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
