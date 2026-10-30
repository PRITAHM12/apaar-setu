export type RoleType = 
  | 'ROLE_COUNCIL_ADMIN' 
  | 'ROLE_INST_NODAL' 
  | 'ROLE_STUDENT' 
  | 'ROLE_VERIFIER';

export type ScreenType = 
  | 'LANDING'
  | 'SCREEN_OAUTH' 
  | 'TAB_STUDENT' 
  | 'TAB_COLLEGE' 
  | 'TAB_VERIFIER' 
  | 'TAB_AICTE';

export type EnrollmentStatus = 
  | 'ACTIVE' 
  | 'TRANSFERRED' 
  | 'GRADUATED' 
  | 'REVOKED' 
  | 'BLOCKED';

export type ConsentStatus = 
  | 'PENDING' 
  | 'APPROVED' 
  | 'REVOKED' 
  | 'EXPIRED';

export interface SemesterCredit {
  semester: number;
  sgpa: number;
  cgpa: number;
  credits: number;
  hash: string;
  verified: boolean;
  issuedAt?: string;
}

export interface StudentRecord {
  id: string;
  apaarId: string;
  institutionalStudentId?: string;
  isSupernumerary?: boolean;
  isNRI?: boolean;
  isOCI?: boolean;
  isForeignNational?: boolean;
  fullName: string;
  program: string;
  semester: number;
  sgpa: number;
  cgpa: number;
  abcCredits: number;
  institutePid: string;
  instituteName: string;
  status: EnrollmentStatus;
  semesters: SemesterCredit[];
  dateOfBirth?: string;
  gender?: string;
  email?: string;
}

export interface IntakeQuotaStats {
  pid: string;
  instituteName: string;
  approvedIntake: number;
  currentEnrollment: number;
  availableQuota: number;
  supernumeraryCount: number;
  nriOciCount: number;
  foreignNationalCount: number;
}

export interface AnomalyFeedItem {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'HIGH';
  anomalyType: 'INTAKE_OVERFLOW' | 'DUAL_ENROLLMENT' | 'INVALID_APAAR' | 'DUPLICATE_INSTITUTION_ID' | 'DATA_INCONSISTENCY';
  institutePid: string;
  instituteName: string;
  title: string;
  details: string;
  actionTaken: string;
}

export interface DPDPConsent {
  consentId: string;
  targetApaarId: string;
  requesterOrg: string;
  requesterName: string;
  purpose: string;
  dataScope: string;
  zeroKnowledgeMode: boolean;
  status: ConsentStatus;
  requestedAt: string;
  expiresAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: string;
  httpStatus: number;
  actorEmail: string;
  actorRole: RoleType;
  institutePid?: string;
  details: string;
  prevHash?: string;
  currentHash: string;
}

export interface ForensicScanResult {
  scanId: string;
  apaarId: string;
  studentName: string;
  verdict: 'AUTHENTIC' | 'TAMPERED_CGPA' | 'TAMPERED_CREDITS';
  ocrExtractedCgpa: number;
  officialLedgerCgpa: number;
  hashMatch: boolean;
  confidenceScore: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  scannedAt: string;
  details: string;
}

export interface StateSyncMetric {
  state: string;
  totalInstitutes: number;
  activeInstitutes: number;
  onboardedStudents: number;
  syncRatePercentage: number;
  creditsMobilityCount: number;
}

export interface BlockedFraudRecord {
  id: string;
  apaarId: string;
  studentName: string;
  existingActivePid: string;
  existingInstituteName: string;
  attemptedPid: string;
  attemptedInstituteName: string;
  program: string;
  timestamp: string;
  reason: string;
  httpStatus: 409;
}

export interface OAuthSession {
  accessToken: string;
  tokenType: string;
  scope: string;
  userProfile: {
    name: string;
    role: RoleType;
    identifier: string;
    tenantPid?: string;
    apaarId?: string;
    org?: string;
    provider: string;
    email?: string;
  };
  issuedAt: string;
}

