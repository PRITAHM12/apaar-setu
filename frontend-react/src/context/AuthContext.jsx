import React, { createContext, useContext, useState } from 'react';

// ============================================================================
// OFFICIAL DOCUMENTED SYSTEM ROLES (Strict 4-Role RBAC Matrix from RBAC.MD)
// 1. ROLE_INST_NODAL    - Institute Nodal Officer (Scoped to PID-1-4920182)
// 2. ROLE_STUDENT       - Enrolled Technical Student (Scoped to APAAR 7841-9023-4412)
// 3. ROLE_COUNCIL_ADMIN - National Regulatory Officer (Apex Authority NATIONAL_ALL)
// 4. ROLE_VERIFIER      - Corporate HR / BGV Agency (Scoped to ORG-INFOSYS-BGV)
// ============================================================================

export const OFFICIAL_ROLES = {
  ROLE_INST_NODAL: {
    roleCode: 'ROLE_INST_NODAL',
    roleTitle: 'Institute Nodal Officer',
    personaName: 'Dr. Alok Verma',
    email: 'nodal.officer@lncte.edu.in',
    identifier: 'PID-1-4920182',
    tenantPid: 'PID-1-4920182',
    tenantName: 'Lakshmi Narain College of Technology & Excellence, Bhopal',
    authorityScope: 'Single-Tenant Institutional Scoping (PID-1-4920182)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  ROLE_STUDENT: {
    roleCode: 'ROLE_STUDENT',
    roleTitle: 'Enrolled Technical Student',
    personaName: 'Pritam Raj Chaurasiya',
    email: 'pritam.raj@student.gov.in',
    identifier: '7841-9023-4412',
    apaarId: '7841-9023-4412',
    tenantPid: 'PID-1-4920182',
    tenantName: 'Lakshmi Narain College of Technology & Excellence, Bhopal',
    authorityScope: 'Self-Sovereign Academic Passport & DPDP 2023 Consent Wallet',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  ROLE_COUNCIL_ADMIN: {
    roleCode: 'ROLE_COUNCIL_ADMIN',
    roleTitle: 'National Regulatory Officer',
    personaName: 'Prof. Ramesh K. Sundaram',
    email: 'director.regulatory@aicte.gov.in',
    identifier: 'NATIONAL-COUNCIL-HQ',
    tenantPid: 'NATIONAL_ALL',
    tenantName: 'National Regulatory Directorate & AICTE Sentinel',
    authorityScope: 'Apex Council Oversight & Cross-Institute Intake Sentinel',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  },
  ROLE_VERIFIER: {
    roleCode: 'ROLE_VERIFIER',
    roleTitle: 'Corporate HR / BGV Agency',
    personaName: 'Pooja Iyer',
    email: 'bgv.talent@infosys.com',
    identifier: 'ORG-INFOSYS-BGV',
    tenantPid: 'ORG-INFOSYS-BGV',
    tenantName: 'Infosys Limited • Global Background Verification Cell',
    authorityScope: 'W3C Verifiable Credential & AI Forensic Tamper Inspection',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
  }
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // 'ROLE_INST_NODAL' | 'ROLE_STUDENT' | 'ROLE_COUNCIL_ADMIN' | 'ROLE_VERIFIER'

  const login = (roleCodeOrUsername = 'ROLE_INST_NODAL', _password = '', selectedRole = null) => {
    let cleanInput = (selectedRole || roleCodeOrUsername || '').trim();

    let targetProfile = OFFICIAL_ROLES.ROLE_INST_NODAL;

    if (cleanInput === 'ROLE_STUDENT' || cleanInput.toLowerCase().includes('student') || cleanInput.toLowerCase() === 'user') {
      targetProfile = OFFICIAL_ROLES.ROLE_STUDENT;
    } else if (cleanInput === 'ROLE_COUNCIL_ADMIN' || cleanInput.toLowerCase().includes('council') || cleanInput.toLowerCase().includes('aicte')) {
      targetProfile = OFFICIAL_ROLES.ROLE_COUNCIL_ADMIN;
    } else if (cleanInput === 'ROLE_VERIFIER' || cleanInput.toLowerCase().includes('verifier') || cleanInput.toLowerCase().includes('bgv')) {
      targetProfile = OFFICIAL_ROLES.ROLE_VERIFIER;
    } else {
      // Default to ROLE_INST_NODAL (Institute Nodal Officer)
      targetProfile = OFFICIAL_ROLES.ROLE_INST_NODAL;
    }

    setCurrentUser(targetProfile);
    setRole(targetProfile.roleCode);
    return { success: true, user: targetProfile };
  };

  const logout = () => {
    setCurrentUser(null);
    setRole(null);
  };

  const switchRole = (newRoleCode) => {
    const profile = OFFICIAL_ROLES[newRoleCode] || OFFICIAL_ROLES.ROLE_INST_NODAL;
    setCurrentUser(profile);
    setRole(profile.roleCode);
  };

  const value = {
    currentUser,
    role,
    isAuthenticated: Boolean(currentUser),
    login,
    logout,
    switchRole,
    OFFICIAL_ROLES
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
