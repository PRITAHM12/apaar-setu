import React, { createContext, useContext, useState } from 'react';

// ============================================================================
// MOCK AUTHENTICATION CONTEXT (REPLACES SUPABASE AUTH COMPLETELY)
// ============================================================================

export const MOCK_USERS = {
  admin: {
    id: 'usr_admin_001',
    username: 'admin',
    name: 'Dr. Alok Verma',
    email: 'nodal.officer@lncte.edu.in',
    role: 'admin',
    roleCode: 'ROLE_INST_NODAL',
    tenantPid: 'PID-1-4920182',
    tenantName: 'Lakshmi Narain College of Technology & Excellence, Bhopal',
    authorityTitle: 'Institutional Nodal Officer • AICTE Monitored Tenant',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  user: {
    id: 'usr_student_002',
    username: 'user',
    name: 'Pritam Raj Chaurasiya',
    email: 'pritam.raj@student.gov.in',
    role: 'user',
    roleCode: 'ROLE_STUDENT',
    apaarId: '7841-9023-4412',
    tenantPid: 'PID-1-4920182',
    tenantName: 'Lakshmi Narain College of Technology & Excellence, Bhopal',
    authorityTitle: 'Enrolled Technical Student • B.Tech CSE (3rd Sem)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Global auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // 'admin' | 'user'

  // Mock login function that accepts dummy credentials (e.g. 'admin' or 'user')
  const login = (usernameInput = '', passwordInput = '', fallbackRole = null) => {
    const cleanUser = (usernameInput || '').trim().toLowerCase();

    // Determine target mock profile
    let targetProfile = null;
    if (cleanUser === 'admin' || fallbackRole === 'admin' || cleanUser.includes('admin') || cleanUser.includes('nodal')) {
      targetProfile = MOCK_USERS.admin;
    } else {
      // Default to user / student
      targetProfile = MOCK_USERS.user;
    }

    setCurrentUser(targetProfile);
    setRole(targetProfile.role);
    return { success: true, user: targetProfile };
  };

  // Mock logout function
  const logout = () => {
    setCurrentUser(null);
    setRole(null);
  };

  // Fast switcher for SIH hackathon evaluation demos
  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      setCurrentUser(MOCK_USERS.admin);
      setRole('admin');
    } else {
      setCurrentUser(MOCK_USERS.user);
      setRole('user');
    }
  };

  const value = {
    currentUser,
    role,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    switchRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
