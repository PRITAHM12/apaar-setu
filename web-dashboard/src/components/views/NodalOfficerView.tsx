import React, { useState, useRef } from 'react';
import { 
  UserPlus, 
  CheckCircle2, 
  AlertOctagon, 
  Search, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  ShieldCheck,
  RefreshCw,
  Gauge,
  AlertTriangle,
  Upload,
  Download,
  AlertCircle,
  FileCheck,
  SlidersHorizontal,
  Save,
  Flag
} from 'lucide-react';
import { useAuthRBAC } from '../../context/AuthRBACContext';
import { BulkScanFDRSection } from '../common/BulkScanFDRSection';

export interface BatchRecordResult {
  row: number;
  fullName: string;
  institutionalId: string;
  apaarId: string;
  category: string;
  status: 'COMMITTED' | 'BLOCKED';
  errorCode?: string;
  reason: string;
}

export interface BatchReport {
  fileName: string;
  totalProcessed: number;
  successCount: number;
  duplicateBlocked: number;
  intakeBlocked: number;
  processedAt: string;
  records: BatchRecordResult[];
}

interface CourseSeatAllocation {
  code: string;
  courseName: string;
  sanctionedIntake: number;
  actualEnrolled: number;
  supernumeraryTfw: number;
  nriOci: number;
  status: 'NEAR_CAPACITY' | 'OPTIMAL' | 'AVAILABLE';
}

export const NodalOfficerView: React.FC = () => {
  const { 
    studentsList, 
    activeTenantPid,
    activeTenantName, 
    intakeStats,
    onboardStudent, 
    runBatchSyncSimulator,
    triggerIntakeLimitTest,
    addAuditLog,
    toggleFlagStudent
  } = useAuthRBAC();

  // Course & Seat Matrix State
  const [courseMatrix, setCourseMatrix] = useState<CourseSeatAllocation[]>([
    {
      code: 'CSE-101',
      courseName: 'B.Tech Computer Science & Engineering',
      sanctionedIntake: 60,
      actualEnrolled: 58,
      supernumeraryTfw: 3,
      nriOci: 2,
      status: 'NEAR_CAPACITY'
    },
    {
      code: 'IT-102',
      courseName: 'B.Tech Information Technology',
      sanctionedIntake: 60,
      actualEnrolled: 52,
      supernumeraryTfw: 2,
      nriOci: 1,
      status: 'OPTIMAL'
    },
    {
      code: 'ECE-103',
      courseName: 'B.Tech Electronics & Communication',
      sanctionedIntake: 60,
      actualEnrolled: 48,
      supernumeraryTfw: 2,
      nriOci: 0,
      status: 'AVAILABLE'
    },
    {
      code: 'MECH-104',
      courseName: 'B.Tech Mechanical Engineering',
      sanctionedIntake: 60,
      actualEnrolled: 42,
      supernumeraryTfw: 1,
      nriOci: 0,
      status: 'AVAILABLE'
    }
  ]);
  const [matrixSaveSuccess, setMatrixSaveSuccess] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [apaarId, setApaarId] = useState('');
  const [institutionalStudentId, setInstitutionalStudentId] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('1');
  const [cgpa, setCgpa] = useState('8.50');

  // AICTE 4 Strict Boolean Toggles
  const [isSupernumerary, setIsSupernumerary] = useState(false);
  const [isNRI, setIsNRI] = useState(false);
  const [isOCI, setIsOCI] = useState(false);
  const [isForeignNational, setIsForeignNational] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTestingIntake, setIsTestingIntake] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // Bulk CSV Upload & Automated Validation Engine State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingCsv, setIsDraggingCsv] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchReport, setBatchReport] = useState<BatchReport | null>(null);
  const [batchFilter, setBatchFilter] = useState<'ALL' | 'BLOCKED' | 'SUCCESS'>('ALL');

  // Search & Copy
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Warning & Anomaly Banners State
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [intakeAnomalyAlert, setIntakeAnomalyAlert] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleFormatApaar = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.slice(i, i + 4));
    }
    setApaarId(parts.join('-'));
  };

  const handleUpdateSanctionedIntake = (code: string, newLimit: number) => {
    setCourseMatrix(prev => prev.map(c => {
      if (c.code === code) {
        const updated = Math.max(30, Math.min(240, newLimit));
        return {
          ...c,
          sanctionedIntake: updated,
          status: (c.actualEnrolled / updated) >= 0.95 ? 'NEAR_CAPACITY' : (c.actualEnrolled / updated) >= 0.8 ? 'OPTIMAL' : 'AVAILABLE'
        };
      }
      return c;
    }));
  };

  const handleSaveCourseMatrix = () => {
    setMatrixSaveSuccess('✓ AICTE Gazette Sanctioned Intake Matrix updated and anchored to national ledger.');
    setTimeout(() => setMatrixSaveSuccess(null), 4000);
    if (addAuditLog) {
      addAuditLog(
        'COURSE_SEAT_MATRIX_UPDATED',
        200,
        `Institutional Nodal Officer updated Sanctioned Intake Matrix across 4 B.Tech engineering departments.`
      );
    }
  };

  const handleAdmitStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || apaarId.length !== 14) {
      alert('Please enter a valid student name and 12-digit APAAR ID (format: XXXX-XXXX-XXXX).');
      return;
    }

    setIsSubmitting(true);
    setSuccessBanner(null);
    setDuplicateWarning(null);
    setIntakeAnomalyAlert(null);

    // AICTE Intake Quota Validation Engine Simulation:
    if (!isSupernumerary && intakeStats.currentEnrollment >= intakeStats.approvedIntake) {
      setIsSubmitting(false);
      setIntakeAnomalyAlert(
        "HTTP 422 - Admission Exceeds Approved Intake: Admission of 61st student exceeds AICTE Approved Intake of 60 for PID-1-4920182. Strict Quota Enforcement: AICTE Section 10(k) prohibits technical institutions from enrolling candidates beyond sanctioned intake without formal regulatory council amendment."
      );
      if (addAuditLog) {
        addAuditLog(
          'ADMISSION_INTAKE_EXCEEDED',
          422,
          `HTTP 422: Attempted admission for ${fullName.trim()} blocked. Approved intake (60) exceeded.`
        );
      }
      return;
    }

    const res = await onboardStudent({
      fullName: fullName.trim(),
      apaarId: apaarId.trim(),
      institutionalStudentId: institutionalStudentId.trim() || undefined,
      isSupernumerary,
      isNRI,
      isOCI,
      isForeignNational,
      program: `B.Tech - ${branch}`,
      semester: parseInt(semester, 10),
      cgpa: parseFloat(cgpa) || 8.0,
      credits: 22,
    });

    setIsSubmitting(false);

    if (res.success) {
      setSuccessBanner(`✓ Successfully admitted ${fullName}! Digitally anchored to national APAAR registry.`);
      setFullName('');
      setApaarId('');
      setInstitutionalStudentId('');
      setIsSupernumerary(false);
      setIsNRI(false);
      setIsOCI(false);
      setIsForeignNational(false);
      setTimeout(() => setSuccessBanner(null), 5000);
    } else {
      if (res.error?.includes('Approved Intake') || res.error?.includes('Intake')) {
        setIntakeAnomalyAlert(res.error);
      } else {
        setDuplicateWarning(res.error || 'Failed to admit student. Please check details.');
      }
    }
  };

  const handleSimulateDuplicateAdmission = async () => {
    setIsSyncing(true);
    setSuccessBanner(null);
    setIntakeAnomalyAlert(null);
    const result = await runBatchSyncSimulator();
    setIsSyncing(false);

    if (!result.success) {
      setDuplicateWarning(
        "HTTP 409 CONFLICT — DUPLICATE ADMISSION BLOCKED! Student Rohan Verma (APAAR: 8832-5519-1029) already holds an ACTIVE full-time enrollment at Institute PID-1-3310. Dual admission and scholarship leakage prevented."
      );
    }
  };

  const handleTestIntakeLimit = async () => {
    setIsTestingIntake(true);
    setDuplicateWarning(null);
    setSuccessBanner(null);
    const res = await triggerIntakeLimitTest();
    setIsTestingIntake(false);
    setIntakeAnomalyAlert(
      res.error || "HTTP 422 - Admission Exceeds Approved Intake: Anomaly Detected: Admission of 61st student exceeds AICTE Approved Intake of 60 for PID-1-4920182."
    );
  };

  const handleRunBulkCsvValidation = async (customFileName?: string) => {
    setIsProcessingBatch(true);
    setSuccessBanner(null);
    setDuplicateWarning(null);
    setIntakeAnomalyAlert(null);

    // Realistic simulation of 60 records processed against AICTE rules
    await new Promise(r => setTimeout(r, 700));

    const records: BatchRecordResult[] = [];
    
    // Rows 1-58: Successfully committed
    for (let i = 1; i <= 58; i++) {
      let category = 'Regular Approved';
      if (i === 51) category = 'Supernumerary (TFW)';
      else if (i === 54) category = 'NRI Quota';
      else if (i === 56) category = 'OCI Quota';
      else if (i === 58) category = 'Foreign National';

      records.push({
        row: i,
        fullName: i === 1 ? 'Pritam Raj Chaurasiya' : `Admitted Student ${i}`,
        institutionalId: `LNCTE-CSE-2022-${String(i).padStart(3, '0')}`,
        apaarId: i === 1 ? '7841-9023-4412' : `7841-9023-${String(4400 + i).padStart(4, '0')}`,
        category,
        status: 'COMMITTED',
        reason: 'Validated against AICTE Intake ledger and cryptographically anchored.'
      });
    }

    // Row 59: Blocked due to Duplicate Institutional ID (Rule B)
    records.push({
      row: 59,
      fullName: 'Rahul Sharma (Duplicate Record)',
      institutionalId: 'LNCTE-CSE-2022-042',
      apaarId: '9012-3456-7890',
      category: 'Regular Approved',
      status: 'BLOCKED',
      errorCode: 'ERR_DUPLICATE_INSTITUTIONAL_ID',
      reason: 'Duplicate student record detected: Institutional ID LNCTE-CSE-2022-042 already exists in current session.'
    });

    // Row 60: Blocked due to Approved Intake Exceeded (Rule C)
    records.push({
      row: 60,
      fullName: 'Neha Verma (Intake Overflow)',
      institutionalId: 'LNCTE-CSE-2022-061',
      apaarId: '6543-2109-8765',
      category: 'Regular Approved',
      status: 'BLOCKED',
      errorCode: 'ERR_APPROVED_INTAKE_EXCEEDED',
      reason: 'HTTP 422: AICTE Gazette Approved Intake (60 seats) exceeded. Attempted admission of 61st student on regular quota.'
    });

    const report: BatchReport = {
      fileName: customFileName || 'SIS_Admissions_Batch_2026_BTech_CSE.csv',
      totalProcessed: 60,
      successCount: 58,
      duplicateBlocked: 1,
      intakeBlocked: 1,
      processedAt: new Date().toLocaleTimeString(),
      records
    };

    setBatchReport(report);
    setIsProcessingBatch(false);

    setIntakeAnomalyAlert(
      "HTTP 422 - Admission Exceeds Approved Intake: Batch Processing Engine rejected Record #60 (Neha Verma). Approved intake capacity of 60 regular seats exceeded for PID-1-4920182."
    );

    if (addAuditLog) {
      addAuditLog(
        'BATCH_CSV_SYNC_COMPLETED',
        422,
        `Bulk CSV (${report.fileName}) processed: 58 committed, 1 duplicate blocked, 1 intake overflow blocked (HTTP 422).`
      );
    }
  };

  const handleExportBatchReportCsv = () => {
    if (!batchReport) return;
    const header = "Row,Student Name,Institutional ID,APAAR ID,Category,Status,Diagnostic Reason\n";
    const rows = batchReport.records.map(r => 
      `${r.row},"${r.fullName}","${r.institutionalId}","${r.apaarId}","${r.category}","${r.status}","${r.reason.replace(/"/g, '""')}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Batch_Processing_Report_${activeTenantPid}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredStudents = studentsList.filter(s => 
    s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.apaarId.includes(searchQuery) ||
    (s.institutionalStudentId && s.institutionalStudentId.toLowerCase().includes(searchQuery.toLowerCase())) ||
    s.program.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const percentageFilled = Math.min(100, Math.round((intakeStats.currentEnrollment / intakeStats.approvedIntake) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ======================================================== */}
      {/* 1. HEADER SECTION: Institutional Nodal Hub | PID         */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Institutional Nodal Hub
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold">
              PID: {activeTenantPid}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Institutional Nodal Hub | PID: {activeTenantPid}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            {activeTenantName} • Enforce AICTE approved intake quotas and prevent duplicate cross-college enrollments.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AICTE Section 10-K Guard Active</span>
          </span>
        </div>
      </div>

      {/* Global Flagged Student Cross-Institution Demo Trigger */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
            🚩
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-extrabold text-white">Global Flagged Student Cascade Demo</h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                Cross-Entity Synchronized
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Toggle flag on Student <strong>7841-9023-4412 (Pritam Raj)</strong> to see the stark red warning banner cascade across the student's APAAR ID card, AICTE regulatory hub, and verifier consoles.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => toggleFlagStudent('7841-9023-4412', 'Forged FDR Document / Academic Discrepancy', 'LNCTS')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-md active:scale-95 flex-shrink-0 ${
            studentsList.find(s => s.apaarId === '7841-9023-4412')?.isFlagged
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <span>{studentsList.find(s => s.apaarId === '7841-9023-4412')?.isFlagged ? '✓' : '🚩'}</span>
          <span>
            {studentsList.find(s => s.apaarId === '7841-9023-4412')?.isFlagged
              ? 'Resolve / Unflag (7841-9023-4412)'
              : 'Flag Student (7841-9023-4412)'}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP METRICS ROW: INTAKE QUOTA TRACKER                 */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  AICTE Approved Intake Quota Tracker
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {percentageFilled}% Capacity
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AICTE Gazette Approved Capacity: 60 Seats in B.Tech Computer Science & Engineering (PID-1-4920182)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-test-intake-limit"
              type="button"
              onClick={handleTestIntakeLimit}
              disabled={isTestingIntake}
              className="px-4 py-2 rounded-xl border-2 border-red-500 text-red-600 font-bold text-xs flex items-center space-x-1.5 hover:bg-red-600 hover:text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isTestingIntake ? 'Evaluating Limit...' : 'Test Intake Limit Exceeded (HTTP 422)'}</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Numerical Metrics */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold gap-2">
            <span className="text-[#0F172A] text-sm">
              Actual Enrollment: <strong className="text-blue-700 font-black text-base">{intakeStats.currentEnrollment}</strong> / Approved Intake: <strong className="text-slate-900 font-black text-base">{intakeStats.approvedIntake}</strong>
            </span>
            <span className="text-slate-600 font-mono text-xs">
              Remaining Quota: <strong className={intakeStats.availableQuota <= 2 ? 'text-amber-700' : 'text-emerald-700'}>{intakeStats.availableQuota} seats left</strong>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                percentageFilled >= 100 
                  ? 'bg-red-600' 
                  : percentageFilled >= 90 
                    ? 'bg-gradient-to-r from-amber-500 to-blue-700' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700'
              }`}
              style={{ width: `${percentageFilled}%` }}
            />
          </div>

          {/* 4 AICTE Sub-Quota Category Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Regular Seats</span>
              <span className="text-sm font-black text-[#0F172A]">{intakeStats.currentEnrollment} admitted</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">Supernumerary (TFW)</span>
              <span className="text-sm font-black text-indigo-700">{intakeStats.supernumeraryCount} active</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">NRI Quota (5%)</span>
              <span className="text-sm font-black text-emerald-700">{intakeStats.nriOciCount} admitted</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[10px] font-bold uppercase tracking-wider">OCI / Foreign National</span>
              <span className="text-sm font-black text-teal-700">{intakeStats.foreignNationalCount} admitted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intake Limit Exceeded Alert Banner (HTTP 422) */}
      {intakeAnomalyAlert && (
        <div id="intake-alert-banner" className="p-5 rounded-2xl bg-red-50 border-2 border-red-400 text-red-950 shadow-sm flex items-start space-x-3.5 animate-in slide-in-from-top-3 duration-200">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertCircle className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-extrabold text-red-950">
                HTTP 422 - Admission Exceeds Approved Intake
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-red-200 text-red-900 rounded-md">
                AICTE Quota Anomaly
              </span>
            </div>
            <p className="text-xs text-red-900 mt-1 leading-relaxed font-semibold">
              {intakeAnomalyAlert}
            </p>
            <p className="text-[11px] text-red-800 mt-0.5">
              Strict Quota Enforcement: AICTE Section 10(k) prohibits technical institutions from enrolling candidates beyond sanctioned intake without formal regulatory council amendment.
            </p>
            <div className="mt-2.5 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIntakeAnomalyAlert(null)}
                className="text-[11px] font-bold text-red-800 hover:text-red-950 underline"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Warning Alert Banner (HTTP 409) */}
      {duplicateWarning && (
        <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-400 text-red-950 shadow-sm flex items-start space-x-3.5 animate-in slide-in-from-top-3 duration-200">
          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertOctagon className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-extrabold text-red-900">
              Dual-Enrollment Conflict Detected!
            </h4>
            <p className="text-xs text-red-800 mt-1 leading-relaxed">
              {duplicateWarning}
            </p>
            <div className="mt-2.5 flex items-center space-x-2">
              <span className="text-[11px] font-mono bg-red-100 text-red-800 px-2.5 py-0.5 rounded-md border border-red-200">
                AICTE Rule 4.2 • HTTP 409 Conflict
              </span>
              <button
                type="button"
                onClick={() => setDuplicateWarning(null)}
                className="text-[11px] font-bold text-red-700 hover:text-red-900 underline ml-2"
              >
                Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 shadow-sm flex items-center space-x-3 animate-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span className="text-sm font-bold text-emerald-900">{successBanner}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* BULK SCAN FEATURE SECTION (FDR & SECURITY DEPOSIT AUDIT) */}
      {/* ======================================================== */}
      <BulkScanFDRSection roleVariant="ROLE_INST_NODAL" />

      {/* ======================================================== */}
      {/* 3. MASSIVE CENTRAL BULK CSV UPLOAD DRAG-AND-DROP ZONE     */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Upload className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A]">
                  Institutional Bulk CSV Enrollment & Automated Validation Engine
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Rule Engine 4.2
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Upload student rosters for automated verification against the national intake quota and duplicate roll ID registry.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
              AICTE Section 10-K Active
            </span>
          </div>
        </div>

        {/* Hidden native file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleRunBulkCsvValidation(file.name);
            }
          }}
        />

        {/* Massive Drag & Drop Area */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingCsv(true);
          }}
          onDragLeave={() => setIsDraggingCsv(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingCsv(false);
            const file = e.dataTransfer.files?.[0];
            if (file) {
              handleRunBulkCsvValidation(file.name);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`p-10 sm:p-12 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all duration-200 ${
            isDraggingCsv 
              ? 'border-blue-500 bg-blue-50/70 scale-[1.01]' 
              : 'border-slate-300 hover:border-blue-600 bg-slate-50/80 hover:bg-blue-50/40'
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-white text-blue-600 flex items-center justify-center mx-auto shadow-sm border border-slate-200 mb-4">
            <Upload className="w-8 h-8 stroke-[2]" />
          </div>
          <h3 className="text-lg font-extrabold text-[#0F172A]">
            {isProcessingBatch ? 'Running Automated Validation Engine...' : 'Drag & Drop Institutional CSV Batch Here'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            or click to browse from your student information system (SIS / ERP). Supported format: <strong className="text-slate-800">.CSV (UTF-8)</strong>
          </p>
          <div className="mt-3 text-[11px] text-slate-400 font-mono">
            Mandatory Schema: FullName, InstitutionalStudentID, 12DigitAPAAR, Category, Semester, CGPA
          </div>
        </div>

        {/* 1-Click Test Trigger */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="text-xs text-slate-500">
            Need sample data? Run the regulatory compliance test batch.
          </div>
          <button
            id="btn-load-sample-csv-batch"
            type="button"
            onClick={() => handleRunBulkCsvValidation('SIS_Admissions_Batch_2026_BTech_CSE.csv')}
            disabled={isProcessingBatch}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-all hover:shadow-lg disabled:opacity-50"
          >
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span>{isProcessingBatch ? 'Processing 60 Records...' : '⚡ Load Sample AICTE Intake Compliance Batch (60 Records)'}</span>
          </button>
        </div>

        {/* BATCH PROCESSING REPORT TABLE (Shows when CSV is tested/uploaded) */}
        {batchReport && (
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 animate-in slide-in-from-top-3 duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#0F172A]">Batch Processing Report</h4>
                  <p className="text-xs text-slate-500 font-mono">
                    File: {batchReport.fileName} • Processed at {batchReport.processedAt}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleExportBatchReportCsv}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-bold text-xs flex items-center space-x-1.5 hover:bg-slate-900 hover:text-white transition-all shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report (CSV)</span>
              </button>
            </div>

            {/* 4 Summary Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-slate-500 block text-[10px] font-bold uppercase">Total Records</span>
                <span className="text-base font-black text-[#0F172A]">{batchReport.totalProcessed}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <span className="text-emerald-700 block text-[10px] font-bold uppercase">Success Committed</span>
                <span className="text-base font-black text-emerald-800">{batchReport.successCount}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200">
                <span className="text-red-700 block text-[10px] font-bold uppercase">Duplicate Blocked</span>
                <span className="text-base font-black text-red-800">{batchReport.duplicateBlocked}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <span className="text-rose-700 block text-[10px] font-bold uppercase">Intake Exceeded</span>
                <span className="text-base font-black text-rose-800">{batchReport.intakeBlocked}</span>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setBatchFilter('ALL')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  batchFilter === 'ALL' ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                All ({batchReport.records.length})
              </button>
              <button
                type="button"
                onClick={() => setBatchFilter('BLOCKED')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  batchFilter === 'BLOCKED' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                }`}
              >
                Blocked Anomalies (2)
              </button>
              <button
                type="button"
                onClick={() => setBatchFilter('SUCCESS')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  batchFilter === 'SUCCESS' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                Committed (58)
              </button>
            </div>

            {/* Report Table */}
            <div className="overflow-x-auto max-h-[280px] overflow-y-auto border border-slate-200 rounded-xl bg-white">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Student ID</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Diagnostic Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batchReport.records
                    .filter(r => {
                      if (batchFilter === 'BLOCKED') return r.status === 'BLOCKED';
                      if (batchFilter === 'SUCCESS') return r.status === 'COMMITTED';
                      return true;
                    })
                    .map((rec) => (
                      <tr 
                        key={rec.row} 
                        className={`hover:bg-slate-50 transition-colors ${rec.status === 'BLOCKED' ? 'bg-red-50/50' : ''}`}
                      >
                        <td className="py-2 px-3 font-mono text-slate-500 font-bold">{rec.row}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{rec.fullName}</td>
                        <td className="py-2 px-3 font-mono text-slate-700">{rec.institutionalId}</td>
                        <td className="py-2 px-3 text-slate-600">{rec.category}</td>
                        <td className="py-2 px-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            rec.status === 'COMMITTED' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-[11px] text-slate-600 max-w-[220px] truncate" title={rec.reason}>
                          {rec.reason}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. "COURSE & SEAT MATRIX" WIDGET (AICTE INTAKE LIMITS)   */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-extrabold text-[#0F172A]">Course & Seat Matrix</h3>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Sanctioned Intake Governance
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage and audit AICTE approved intake ceilings across affiliated departments for session 2026-27.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveCourseMatrix}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Sanctioned Intake</span>
          </button>
        </div>

        {matrixSaveSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{matrixSaveSuccess}</span>
          </div>
        )}

        {/* Course & Seat Matrix Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Course Code</th>
                <th className="py-2.5 px-3">Program / Department</th>
                <th className="py-2.5 px-3">Sanctioned Intake</th>
                <th className="py-2.5 px-3">Actual Enrolled</th>
                <th className="py-2.5 px-3">Supernumerary (TFW)</th>
                <th className="py-2.5 px-3">Vacant Seats</th>
                <th className="py-2.5 px-3 text-right">Quota Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courseMatrix.map((c) => {
                const vacancy = Math.max(0, c.sanctionedIntake - c.actualEnrolled);
                return (
                  <tr key={c.code} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700">{c.code}</td>
                    <td className="py-2.5 px-3 font-bold text-[#0F172A]">{c.courseName}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="30"
                          max="240"
                          step="10"
                          value={c.sanctionedIntake}
                          onChange={(e) => handleUpdateSanctionedIntake(c.code, parseInt(e.target.value, 10) || 60)}
                          className="w-16 px-2 py-1 rounded-lg border border-slate-300 font-mono text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-[10px] text-slate-400">seats</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-blue-700">{c.actualEnrolled}</td>
                    <td className="py-2.5 px-3 text-slate-600">{c.supernumeraryTfw} active</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">
                      <span className={vacancy <= 2 ? 'text-amber-700 font-black' : 'text-emerald-700'}>
                        {vacancy} seats
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.status === 'NEAR_CAPACITY'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : c.status === 'OPTIMAL'
                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}>
                        {c.status === 'NEAR_CAPACITY' ? 'Near Capacity (96.7%)' : c.status === 'OPTIMAL' ? 'Optimal (86.7%)' : 'Available Seats'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. 2-COLUMN SPLIT: FORM (5 cols) vs DIRECTORY (7 cols)    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: MANUAL ADD SINGLE STUDENT */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Add Single Student Record</h3>
                <p className="text-xs text-slate-500">Standard inputs with required AICTE quota flags.</p>
              </div>
            </div>

            <form onSubmit={handleAdmitStudent} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanya Malhotra"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Institutional Student ID</label>
                  <input
                    type="text"
                    required
                    placeholder="LNCTE-CSE-2024-059"
                    value={institutionalStudentId}
                    onChange={(e) => setInstitutionalStudentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">12-Digit APAAR ID</label>
                  <input
                    type="text"
                    required
                    maxLength={14}
                    placeholder="XXXX-XXXX-XXXX"
                    value={apaarId}
                    onChange={(e) => handleFormatApaar(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 4 Strict AICTE Boolean Checkboxes */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <span className="font-bold text-[#0F172A] text-[11px] block uppercase tracking-wider">
                  AICTE Category Checkboxes:
                </span>
                
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <label className="flex items-center space-x-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={isSupernumerary}
                      onChange={(e) => setIsSupernumerary(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <div className="leading-tight">
                      <span className="font-bold text-[#0F172A] block">Supernumerary</span>
                      <span className="text-[10px] text-slate-500">TFW / PMSSS Quota</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={isNRI}
                      onChange={(e) => setIsNRI(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <div className="leading-tight">
                      <span className="font-bold text-[#0F172A] block">NRI Quota</span>
                      <span className="text-[10px] text-slate-500">Non-Resident Indian</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={isOCI}
                      onChange={(e) => setIsOCI(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <div className="leading-tight">
                      <span className="font-bold text-[#0F172A] block">OCI Quota</span>
                      <span className="text-[10px] text-slate-500">Overseas Citizen</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer bg-white p-2 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      checked={isForeignNational}
                      onChange={(e) => setIsForeignNational(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <div className="leading-tight">
                      <span className="font-bold text-[#0F172A] block">Foreign National</span>
                      <span className="text-[10px] text-slate-500">Direct FN Quota</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Branch / Course</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Computer Science & Engineering">B.Tech - CSE</option>
                    <option value="Information Technology">B.Tech - IT</option>
                    <option value="Electronics & Communication">B.Tech - ECE</option>
                    <option value="Mechanical Engineering">B.Tech - Mech</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="1">Sem 1</option>
                    <option value="2">Sem 2</option>
                    <option value="3">Sem 3</option>
                    <option value="4">Sem 4</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={cgpa}
                  onChange={(e) => setCgpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Validating Quotas & Anchoring...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Publish & Anchor Record</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick Dual-Enrollment Check */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center space-x-2.5">
              <FileSpreadsheet className="w-5 h-5 text-amber-600" />
              <h4 className="text-xs font-bold text-[#0F172A]">Cross-College Concurrent Enrollment Test</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Test AICTE Rule 4.2: Block dual full-time admission across institutes (HTTP 409 Conflict).
            </p>
            <button
              type="button"
              onClick={handleSimulateDuplicateAdmission}
              disabled={isSyncing}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-slate-900 hover:text-white hover:shadow-lg transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Evaluating Dual Check...' : 'Run Cross-College Duplicate Check (CSV Batch)'}</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ENROLLED STUDENTS DIRECTORY */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Enrolled Students Directory</h3>
                <p className="text-xs text-slate-500">Live roster anchored to AICTE National Academic Ledger</p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search Name, Roll, APAAR..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
                />
              </div>
            </div>

            {/* Standard Clean GovTech Data Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-3">Student ID</th>
                    <th className="py-3 px-3">Candidate Name</th>
                    <th className="py-3 px-3">APAAR ID</th>
                    <th className="py-3 px-3">Category (NRI/OCI)</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Trust Status</th>
                    <th className="py-3 px-3 text-center">Institution Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((s) => {
                    let categoryLabel = 'Regular';
                    let categoryBadgeClass = 'bg-slate-100 text-slate-700 border-slate-200';

                    if (s.isSupernumerary) {
                      categoryLabel = 'Supernumerary (TFW)';
                      categoryBadgeClass = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                    } else if (s.isNRI) {
                      categoryLabel = 'NRI Quota';
                      categoryBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                    } else if (s.isOCI) {
                      categoryLabel = 'OCI Quota';
                      categoryBadgeClass = 'bg-teal-50 text-teal-700 border-teal-200';
                    } else if (s.isForeignNational) {
                      categoryLabel = 'Foreign National';
                      categoryBadgeClass = 'bg-purple-50 text-purple-700 border-purple-200';
                    }

                    return (
                      <tr key={s.id} className={`transition-colors ${s.isFlagged ? 'bg-rose-50/40 hover:bg-rose-50/70' : 'hover:bg-slate-50/80'}`}>
                        <td className="py-3 px-3">
                          <span className="font-mono font-bold text-[#0F172A] block text-xs">
                            {s.institutionalStudentId || 'PENDING'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#0F172A] block">{s.fullName}</span>
                          <span className="text-[11px] text-slate-500">{s.program}</span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center space-x-1 font-mono text-slate-700 text-xs">
                            <span>{s.apaarId}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(s.apaarId)}
                              className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                              title="Copy APAAR ID"
                            >
                              {copiedId === s.apaarId ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${categoryBadgeClass}`}>
                            {categoryLabel}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active / Anchored</span>
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {s.isFlagged ? (
                            <div className="flex flex-col space-y-0.5">
                              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white border border-rose-700 shadow-xs animate-pulse w-fit">
                                <AlertTriangle className="w-3 h-3 text-amber-300" />
                                <span>FLAGGED</span>
                              </span>
                              <span className="text-[10px] text-rose-700 font-bold leading-tight">
                                {s.flagDetails?.flaggedBy}: {s.flagDetails?.reason}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>CLEARED</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleFlagStudent(s.apaarId, 'Forged FDR Document', activeTenantName)}
                            className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all shadow-xs flex items-center space-x-1 mx-auto ${
                              s.isFlagged
                                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                : 'bg-rose-600 hover:bg-rose-700 text-white'
                            }`}
                          >
                            <Flag className="w-3 h-3" />
                            <span>{s.isFlagged ? 'Resolve Flag' : 'Flag Student'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Showing {filteredStudents.length} of {studentsList.length} enrolled students</span>
              <span className="font-mono text-[11px]">AICTE Ledger Sync: Real-Time</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
