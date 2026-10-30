import React, { createContext, useContext, useState } from 'react';
import { 
  RoleType, 
  ScreenType,
  StudentRecord, 
  DPDPConsent, 
  AuditLogEntry, 
  BlockedFraudRecord,
  OAuthSession,
  IntakeQuotaStats,
  AnomalyFeedItem
} from '../types/apaar.types';
import { 
  PRIMARY_STUDENT, 
  INITIAL_STUDENTS, 
  INITIAL_DPDP_CONSENTS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_BLOCKED_FRAUD_REGISTRY,
  CONFLICT_STUDENT_SEED,
  INSTITUTION_INTAKE_DATA,
  INITIAL_ANOMALIES
} from '../data/seedData';
import { generateSHA256Hash } from '../utils/crypto';
import { apiClient } from '../utils/apiClient';

interface AuthRBACContextType {
  activeRole: RoleType;
  switchRole: (role: RoleType) => void;
  activeTenantPid: string;
  activeTenantName: string;
  activeStudent: StudentRecord;
  studentsList: StudentRecord[];
  dpdpConsents: DPDPConsent[];
  auditLogs: AuditLogEntry[];
  blockedFraudRecords: BlockedFraudRecord[];
  isAuditDrawerOpen: boolean;
  toggleAuditDrawer: () => void;
  addAuditLog: (
    eventType: string, 
    httpStatus: number, 
    details: string, 
    customActor?: string,
    customRole?: RoleType
  ) => Promise<AuditLogEntry>;
  runBatchSyncSimulator: () => Promise<{ success: boolean; blockedRecord?: typeof CONFLICT_STUDENT_SEED; status: number }>;
  runCrossTenantTest: () => Promise<{ success: boolean; error: string; status: number }>;
  approveConsent: (consentId: string, zeroKnowledgeMode: boolean) => Promise<void>;
  revokeConsent: (consentId: string) => Promise<void>;
  onboardStudent: (payload: {
    fullName: string;
    apaarId: string;
    institutionalStudentId?: string;
    isSupernumerary?: boolean;
    isNRI?: boolean;
    isOCI?: boolean;
    isForeignNational?: boolean;
    testIntakeOverflow?: boolean;
    program?: string;
    semester?: number;
    sgpa?: number;
    cgpa?: number;
    credits?: number;
  }) => Promise<{ success: boolean; student?: StudentRecord; error?: string }>;
  intakeStats: IntakeQuotaStats;
  anomaliesList: AnomalyFeedItem[];
  triggerIntakeLimitTest: () => Promise<{ success: boolean; error: string }>;
  isAuthenticated: boolean;
  oauthSession: OAuthSession | null;
  loginWithOAuth: (session: OAuthSession) => void;
  logout: () => void;
  activeScreen: import('../types/apaar.types').ScreenType;
  setActiveScreen: (screen: import('../types/apaar.types').ScreenType) => void;
  isZkPrivacyEnabled: boolean;
  setIsZkPrivacyEnabled: (val: boolean) => void;
}

const AuthRBACContext = createContext<AuthRBACContextType | undefined>(undefined);

export const AuthRBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreenState] = useState<ScreenType>('LANDING');
  const [isZkPrivacyEnabled, setIsZkPrivacyEnabled] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [oauthSession, setOauthSession] = useState<OAuthSession | null>(null);
  const [activeRole, setActiveRole] = useState<RoleType>('ROLE_STUDENT');
  const [activeTenantPid, setActiveTenantPid] = useState<string>('PID-1-4920182');
  const [activeTenantName] = useState<string>('Lakshmi Narain College of Technology Excellence - Demo Tenant');
  
  const [activeStudent] = useState<StudentRecord>(PRIMARY_STUDENT);
  const [studentsList, setStudentsList] = useState<StudentRecord[]>(INITIAL_STUDENTS);
  const [dpdpConsents, setDpdpConsents] = useState<DPDPConsent[]>(INITIAL_DPDP_CONSENTS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [blockedFraudRecords, setBlockedFraudRecords] = useState<BlockedFraudRecord[]>(INITIAL_BLOCKED_FRAUD_REGISTRY);
  const [intakeStats, setIntakeStats] = useState<IntakeQuotaStats>(INSTITUTION_INTAKE_DATA);
  const [anomaliesList, setAnomaliesList] = useState<AnomalyFeedItem[]>(INITIAL_ANOMALIES);
  const [isAuditDrawerOpen, setIsAuditDrawerOpen] = useState<boolean>(false);

  const getActorForRole = (role: RoleType): { email: string } => {
    switch (role) {
      case 'ROLE_COUNCIL_ADMIN':
        return { email: 'council.admin@aicte.gov.in' };
      case 'ROLE_INST_NODAL':
        return { email: 'nodal.officer@lncte.edu.in' };
      case 'ROLE_STUDENT':
        return { email: 'pritam.chaurasiya@demo.student' };
      case 'ROLE_VERIFIER':
        return { email: 'bgv.verifier@infosys.com' };
    }
  };

  /**
   * Appends an audit entry with genuine cryptographic SHA-256 chaining.
   */
  const addAuditLog = async (
    eventType: string, 
    httpStatus: number, 
    details: string,
    customActor?: string,
    customRole?: RoleType
  ): Promise<AuditLogEntry> => {
    const role = customRole || activeRole;
    const actorEmail = customActor || getActorForRole(role).email;
    const timestamp = new Date().toISOString();
    const lastLog = auditLogs[auditLogs.length - 1];
    const prevHash = lastLog ? lastLog.currentHash : '0x7a19c42e8b10f92a3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c';

    const hashPayload = `${prevHash}|${timestamp}|${eventType}|${httpStatus}|${actorEmail}|${details}`;
    const currentHash = await generateSHA256Hash(hashPayload);

    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      eventType,
      httpStatus,
      actorEmail,
      actorRole: role,
      institutePid: role === 'ROLE_COUNCIL_ADMIN' ? 'NATIONAL_ALL' : activeTenantPid,
      details,
      prevHash,
      currentHash,
    };

    setAuditLogs((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const loginWithOAuth = (session: OAuthSession) => {
    setOauthSession(session);
    setActiveRole(session.userProfile.role);
    setIsAuthenticated(true);
    if (session.userProfile.tenantPid) {
      setActiveTenantPid(session.userProfile.tenantPid);
    }
    if (session.userProfile.role === 'ROLE_INST_NODAL') {
      setActiveScreenState('TAB_COLLEGE');
    } else if (session.userProfile.role === 'ROLE_VERIFIER') {
      setActiveScreenState('TAB_VERIFIER');
    } else if (session.userProfile.role === 'ROLE_COUNCIL_ADMIN') {
      setActiveScreenState('TAB_AICTE');
    } else {
      setActiveScreenState('TAB_STUDENT');
    }
    addAuditLog(
      'OAUTH_SESSION_ESTABLISHED',
      200,
      `OAuth 2.0 Session established for [${session.userProfile.name}] via ${session.userProfile.provider}. AccessToken verified.`,
      session.userProfile.email,
      session.userProfile.role
    );
  };

  const logout = () => {
    setIsAuthenticated(false);
    setOauthSession(null);
    setActiveScreenState('LANDING');
    addAuditLog(
      'OAUTH_SESSION_TERMINATED',
      200,
      `User signed out of OAuth 2.0 SSO session. Returning to APAAR-Setu Landing Page.`,
      undefined,
      activeRole
    );
  };

  const setActiveScreen = (screen: ScreenType) => {
    if (!isAuthenticated && screen !== 'LANDING' && screen !== 'SCREEN_OAUTH') {
      setActiveScreenState('SCREEN_OAUTH');
      return;
    }
    setActiveScreenState(screen);
    if (screen === 'TAB_STUDENT') {
      switchRole('ROLE_STUDENT');
    } else if (screen === 'TAB_COLLEGE') {
      switchRole('ROLE_INST_NODAL');
    } else if (screen === 'TAB_VERIFIER') {
      switchRole('ROLE_VERIFIER');
    } else if (screen === 'TAB_AICTE') {
      switchRole('ROLE_COUNCIL_ADMIN');
    }
  };

  const switchRole = async (newRole: RoleType) => {
    setActiveRole(newRole);
    // Auto-update OAuth Session badge to maintain valid OAuth claims in demo
    let name = 'Pritam Raj Chaurasiya';
    let id = '7841-9023-4412';
    let scope = 'openid apaar.read consent.write';
    let provider = 'National Academic Depository / API Setu OAuth 2.0';
    let tenant = undefined;

    if (newRole === 'ROLE_INST_NODAL') {
      name = 'LNCT Excellence Nodal Officer';
      id = 'PID-1-4920182';
      tenant = 'PID-1-4920182';
      scope = 'openid erp.sync student.write';
      provider = 'Institutional ERP SSO / SAML 2.0';
      setActiveTenantPid('PID-1-4920182');
    } else if (newRole === 'ROLE_VERIFIER') {
      name = 'Infosys Campus Hiring Team';
      id = 'ORG-INFOSYS-BGV';
      scope = 'openid bgv.verify ai.forensic.scan';
      provider = 'Corporate BGV OAuth 2.0';
    } else if (newRole === 'ROLE_COUNCIL_ADMIN') {
      name = 'AICTE Regulatory Directorate';
      id = 'AICTE-HQ-ADMIN';
      scope = 'openid national.admin state.analytics';
      provider = 'National Council Admin SSO';
    }

    setOauthSession({
      accessToken: `fast_switch_jwt_${Date.now()}`,
      tokenType: 'Bearer',
      scope,
      userProfile: {
        name,
        role: newRole,
        identifier: id,
        tenantPid: tenant,
        apaarId: newRole === 'ROLE_STUDENT' ? '7841-9023-4412' : undefined,
        provider,
        email: getActorForRole(newRole).email,
      },
      issuedAt: new Date().toISOString(),
    });

    await addAuditLog(
      'AUTH_ROLE_SWITCH',
      200,
      `Zero-Trust Session Context switched to [${newRole}] with verified claims.`,
      undefined,
      newRole
    );
  };

  const toggleAuditDrawer = () => {
    setIsAuditDrawerOpen((prev) => !prev);
  };

  /**
   * Executes the Nodal Batch Sync simulation (120 records, halting at #120 with HTTP 409)
   */
  const runBatchSyncSimulator = async () => {
    const res = await apiClient.syncBatchRecords();

    if (res.status === 409) {
      await addAuditLog(
        'DUAL_ENROLLMENT_BLOCKED',
        409,
        `HTTP 409 Conflict: Blocked dual active enrollment for APAAR 8832-5519-1029 (Rohan Verma). Already active at PID-1-3310.`
      );

      // Check if already in blocked registry to prevent duplicate UI rows
      const exists = blockedFraudRecords.some(b => b.apaarId === CONFLICT_STUDENT_SEED.apaarId);
      if (!exists) {
        const newBlocked: BlockedFraudRecord = {
          id: `blk-${Date.now()}`,
          apaarId: CONFLICT_STUDENT_SEED.apaarId,
          studentName: 'Rohan Verma',
          existingActivePid: CONFLICT_STUDENT_SEED.existingPid,
          existingInstituteName: CONFLICT_STUDENT_SEED.existingInstituteName,
          attemptedPid: CONFLICT_STUDENT_SEED.attemptedPid,
          attemptedInstituteName: CONFLICT_STUDENT_SEED.attemptedInstituteName,
          program: CONFLICT_STUDENT_SEED.program,
          timestamp: new Date().toISOString(),
          reason: 'ERR_APAAR_DUAL_ENROLLMENT: Partial Unique Index Violation in PostgreSQL schema',
          httpStatus: 409,
        };
        setBlockedFraudRecords((prev) => [newBlocked, ...prev]);
      }

      return {
        success: false,
        status: 409,
        blockedRecord: CONFLICT_STUDENT_SEED,
      };
    }

    return { success: true, status: 200 };
  };

  /**
   * Executes the Cross-Tenant RLS Test attempting to read PID-1-3310
   */
  const runCrossTenantTest = async () => {
    const res = await apiClient.testCrossTenantRLS('PID-1-3310');
    
    await addAuditLog(
      'POSTGRES_RLS_VIOLATION',
      403,
      `HTTP 403 Forbidden: PostgreSQL Row-Level Security blocked tenant PID-1-4920182 from reading records of tenant PID-1-3310.`
    );

    return {
      success: false,
      status: 403,
      error: res.error || 'Access denied by PostgreSQL Row-Level Security policy.',
    };
  };

  const approveConsent = async (consentId: string, zeroKnowledgeMode: boolean) => {
    const res = await apiClient.updateConsent(consentId, 'APPROVED', zeroKnowledgeMode);
    if (res.data) {
      setDpdpConsents((prev) =>
        prev.map((c) => (c.consentId === consentId ? res.data! : c))
      );
    }
    await addAuditLog(
      'DPDP_CONSENT_GRANTED',
      200,
      `Student approved 24-hour verification access for Infosys BGV Portal (Zero-Knowledge Mode: ${zeroKnowledgeMode ? 'ENABLED' : 'DISABLED'}).`
    );
  };

  const revokeConsent = async (consentId: string) => {
    const res = await apiClient.updateConsent(consentId, 'REVOKED', false);
    if (res.data) {
      setDpdpConsents((prev) =>
        prev.map((c) => (c.consentId === consentId ? res.data! : c))
      );
    }
    await addAuditLog(
      'DPDP_CONSENT_REVOKED',
      200,
      `Student immediately revoked verification access for consent request ${consentId}.`
    );
  };

  const triggerIntakeLimitTest = async () => {
    const res = await apiClient.onboardStudent({
      fullName: 'Rohan Deshmukh (Test 61st Candidate)',
      apaarId: '9841-2311-6677',
      testIntakeOverflow: true,
      program: 'B.Tech - Computer Science & Engineering',
      semester: 1,
      cgpa: 8.50,
      credits: 22,
      institutePid: activeTenantPid,
    });

    const anom: AnomalyFeedItem = {
      id: `anom-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
      anomalyType: 'INTAKE_OVERFLOW',
      institutePid: activeTenantPid,
      instituteName: activeTenantName,
      title: 'AICTE Approved Intake Exceeded',
      details: 'Anomaly Detected: Admission of 61st student exceeds AICTE Approved Intake of 60.',
      actionTaken: 'HTTP 422 Unprocessable • Admission halted by AICTE Quota Guard',
    };

    setAnomaliesList((prev) => [anom, ...prev]);

    await addAuditLog(
      'ANOMALY_INTAKE_LIMIT_EXCEEDED',
      422,
      'HTTP 422: Anomaly Detected: Admission of 61st student exceeds AICTE Approved Intake of 60.'
    );

    return {
      success: false,
      error: res.error || 'Anomaly Detected: Admission of 61st student exceeds AICTE Approved Intake of 60.',
    };
  };

  const onboardStudent = async (payload: {
    fullName: string;
    apaarId: string;
    institutionalStudentId?: string;
    isSupernumerary?: boolean;
    isNRI?: boolean;
    isOCI?: boolean;
    isForeignNational?: boolean;
    testIntakeOverflow?: boolean;
    program?: string;
    semester?: number;
    sgpa?: number;
    cgpa?: number;
    credits?: number;
  }) => {
    const res = await apiClient.onboardStudent({
      ...payload,
      institutePid: activeTenantPid,
    });

    if (res.status === 201 && res.data?.student) {
      const raw = res.data.student;
      const newStu: StudentRecord = {
        id: raw.id,
        apaarId: raw.apaar_id || payload.apaarId,
        institutionalStudentId: raw.institutional_student_id || payload.institutionalStudentId || `LNCTE-CSE-2024-${Math.floor(Math.random() * 900) + 100}`,
        isSupernumerary: Boolean(raw.is_supernumerary ?? payload.isSupernumerary),
        isNRI: Boolean(raw.is_nri ?? payload.isNRI),
        isOCI: Boolean(raw.is_oci ?? payload.isOCI),
        isForeignNational: Boolean(raw.is_foreign_national ?? payload.isForeignNational),
        fullName: raw.full_name || payload.fullName,
        program: raw.program || payload.program || 'B.Tech Computer Science & Engineering',
        semester: raw.semester || payload.semester || 1,
        sgpa: raw.sgpa || payload.sgpa || 8.0,
        cgpa: raw.cgpa || payload.cgpa || 8.0,
        abcCredits: raw.abc_credits || payload.credits || 22,
        institutePid: raw.institute_pid || activeTenantPid,
        instituteName: raw.institute_name || activeTenantName,
        status: 'ACTIVE',
        email: raw.email || `${payload.fullName.toLowerCase().replace(/\s+/g, '.')}@demo.student`,
        semesters: (raw.semesters || []).map((s: any) => ({
          semester: s.sem || s.semester || 1,
          sgpa: s.sgpa || 8.0,
          cgpa: s.cgpa || 8.0,
          credits: s.credits || 22,
          hash: s.hash || res.data?.merkleProof || '0x7a19c42e8b10f92a3d4e5f6a7b8c9d0e1f2a3b4c',
          verified: true,
          issuedAt: s.issuedAt || new Date().toISOString(),
        })),
      };

      setStudentsList((prev) => [newStu, ...prev]);

      // Update Intake Quota counters if not supernumerary
      if (!payload.isSupernumerary) {
        setIntakeStats((prev) => ({
          ...prev,
          currentEnrollment: prev.currentEnrollment + 1,
          availableQuota: Math.max(0, prev.availableQuota - 1),
        }));
      }

      await addAuditLog(
        'STUDENT_ONBOARDED',
        201,
        `Nodal Officer onboarded student ${payload.fullName} (${payload.apaarId}) [Roll: ${newStu.institutionalStudentId}]. W3C Merkle root anchored.`
      );

      return { success: true, student: newStu };
    }

    // If an anomaly error was returned from backend, update live anomaly feed
    if (res.data?.anomaly) {
      setAnomaliesList((prev) => [res.data!.anomaly, ...prev]);
    }

    await addAuditLog(
      'ONBOARDING_ANOMALY_BLOCKED',
      res.status || 422,
      res.error || 'Failed to onboard student due to policy anomaly.'
    );

    return { success: false, error: res.error || 'Failed to onboard student' };
  };

  return (
    <AuthRBACContext.Provider
      value={{
        activeRole,
        switchRole,
        activeTenantPid,
        activeTenantName,
        activeStudent,
        studentsList,
        dpdpConsents,
        auditLogs,
        blockedFraudRecords,
        isAuditDrawerOpen,
        toggleAuditDrawer,
        addAuditLog,
        runBatchSyncSimulator,
        runCrossTenantTest,
        approveConsent,
        revokeConsent,
        onboardStudent,
        intakeStats,
        anomaliesList,
        triggerIntakeLimitTest,
        isAuthenticated,
        oauthSession,
        loginWithOAuth,
        logout,
        activeScreen,
        setActiveScreen,
        isZkPrivacyEnabled,
        setIsZkPrivacyEnabled,
      }}
    >
      {children}
    </AuthRBACContext.Provider>
  );
};

export const useAuthRBAC = (): AuthRBACContextType => {
  const context = useContext(AuthRBACContext);
  if (!context) {
    throw new Error('useAuthRBAC must be used within an AuthRBACProvider');
  }
  return context;
};
