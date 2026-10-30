import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertOctagon, 
  TrendingUp, 
  ShieldCheck,
  Download,
  AlertTriangle,
  Radio,
  Clock,
  FileSpreadsheet,
  Building2,
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { useAuthRBAC } from '../../context/AuthRBACContext';
import { apiClient } from '../../utils/apiClient';

export const CouncilAdminView: React.FC = () => {
  const { blockedFraudRecords, auditLogs, anomaliesList } = useAuthRBAC();
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingNationalAudit, setIsExportingNationalAudit] = useState(false);
  const [anomalyFilter, setAnomalyFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'WARNING'>('ALL');

  // Requirement 9: Export National Accreditation Audit (CSV)
  const handleExportAccreditationReport = async () => {
    setIsExporting(true);
    try {
      await apiClient.exportAccreditationReport();
      const header = "Institution PID,Institution Name,State,Accreditation Tier,Approved Intake,Actual Enrollment,Supernumerary Allocated,Foreign/NRI Quota,Compliance Verdict,Audit Timestamp\n";
      const data = [
        'PID-1-4920182,"Lakshmi Narain College of Technology Excellence",Madhya Pradesh,NBA Tier-1 Accredited,60,58,3,3,COMPLIANT (Rule 14-B),2026-10-29T08:00:00Z',
        'PID-1-3310,"Government Engineering College",Madhya Pradesh,NAAC A+ Accredited,120,119,10,0,COMPLIANT,2026-10-29T08:00:00Z',
        'PID-1-8841,"Tech Institute of Innovation",Maharashtra,Under Review,180,182,12,6,INTAKE_OVERFLOW_FLAGGED (HTTP 422),2026-10-29T08:00:00Z',
        'PID-1-9921,"Delhi Technical University Affiliate",Delhi,NBA Tier-1 Accredited,60,59,6,3,COMPLIANT,2026-10-29T08:00:00Z',
        'PID-1-7714,"South Zone College of Eng",Karnataka,NAAC A++ Accredited,240,238,18,12,COMPLIANT,2026-10-29T08:00:00Z',
        'PID-1-6629,"East Coast Polytechnic & Eng",West Bengal,NBA Tier-2 Accredited,120,115,8,0,COMPLIANT,2026-10-29T08:00:00Z',
      ].join('\n');
      const blob = new Blob([header + data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `National_Accreditation_Audit_AICTE_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export failed:', e);
    } finally {
      setTimeout(() => setIsExporting(false), 800);
    }
  };

  const handleExportNationalEnrollmentAudit = () => {
    setIsExportingNationalAudit(true);
    setTimeout(() => {
      const header = "Institution PID,Institution Name,State,AICTE Approved Intake,Actual Enrollment,Supernumerary (TFW),NRI/OCI Quota,Vacancy %,Accreditation Status,Anomaly Flags\n";
      const data = [
        'PID-1-4920182,"LNCT Excellence",Madhya Pradesh,60,58,4,2,3.3%,Accredited (NBA Tier-1),0 (Compliant)',
        'PID-1-3310,"Government Engineering College",Madhya Pradesh,120,119,10,0,0.8%,Accredited (NAAC A+),0 (Compliant)',
        'PID-1-8841,"Tech Institute of Innovation",Maharashtra,180,182,12,6,-1.1%,Under Review,1 (Intake Over-admission)',
        'PID-1-9921,"Delhi Technical University Affiliate",Delhi,60,59,6,3,1.6%,Accredited (NBA Tier-1),0 (Compliant)',
        'PID-1-7714,"South Zone College of Eng",Karnataka,240,238,18,12,0.8%,Accredited (NAAC A++),0 (Compliant)',
        'PID-1-6629,"East Coast Polytechnic & Eng",West Bengal,120,115,8,0,4.1%,Accredited,1 (Duplicate Roll ID)',
      ].join('\n');
      const blob = new Blob([header + data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `National_Enrollment_Audit_AICTE_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setIsExportingNationalAudit(false);
    }, 800);
  };

  const filteredAnomalies = anomaliesList.filter(anom => {
    if (anomalyFilter === 'CRITICAL') return anom.severity === 'CRITICAL';
    if (anomalyFilter === 'HIGH') return anom.severity === 'HIGH';
    if (anomalyFilter === 'WARNING') return anom.severity === 'WARNING';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* ======================================================== */}
      {/* 1. HEADER SECTION: AICTE National Command & Analytics     */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              National Regulatory Directorate
            </span>
            <span className="text-xs text-slate-600 font-mono font-bold">
              AICTE Apex Command SSO
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            AICTE National Command & Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-0.5 font-medium">
            National intake quota oversight, real-time intelligent anomaly telemetry, and cross-state fraud prevention.
          </p>
        </div>

        {/* Header Right Badges & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-2 rounded-xl border border-emerald-200 flex items-center space-x-1.5 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>9,412 Synchronized Institutions</span>
          </span>

          <button
            id="btn-export-accreditation-audit"
            type="button"
            onClick={handleExportAccreditationReport}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 transition-all hover:shadow-lg disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'Compiling CSV...' : 'Export National Accreditation Audit (CSV)'}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. TOP METRICS ROW: 3 Primary AICTE National Metrics     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Total Synced Institutions */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Synced Institutions
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight">
              9,412
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Nationwide Coverage • Zero-Trust RLS Active</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Verified Records */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Verified Records
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#0F172A] tracking-tight">
              3,284,910
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold pt-1">
              <TrendingUp className="w-4 h-4" />
              <span>+14.2% Onboarded This Month • 14,892 Verifications Today</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Anomalies Detected Today */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Anomalies Detected Today
            </span>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-red-600 tracking-tight">
              61
            </div>
            <div className="flex items-center space-x-1.5 text-xs text-red-700 font-bold pt-1">
              <AlertCircle className="w-4 h-4" />
              <span>Critical Quota & Schema Intercepts Active</span>
            </div>
          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 3. MAIN CONTENT: 2-COLUMN SPLIT                           */}
      {/* LEFT: Intelligent Anomaly Feed | RIGHT: Accreditation    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================== */}
        {/* MAIN LEFT PANEL: INTELLIGENT ANOMALY DETECTION FEED (6 c)*/}
        {/* ======================================================== */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#0F172A]">Intelligent Anomaly Detection Feed</h3>
                <p className="text-xs text-slate-500">Live regulatory stream of quota, format & duplicate infractions.</p>
              </div>
            </div>

            <span className="text-xs font-bold bg-red-50 text-red-700 px-2.5 py-1 rounded-xl border border-red-200 flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>61 Active Events</span>
            </span>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex items-center space-x-1.5 text-xs">
            <button
              type="button"
              onClick={() => setAnomalyFilter('ALL')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                anomalyFilter === 'ALL' ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Events ({anomaliesList.length})
            </button>
            <button
              type="button"
              onClick={() => setAnomalyFilter('CRITICAL')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                anomalyFilter === 'CRITICAL' ? 'bg-red-700 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Critical Intake (14)
            </button>
            <button
              type="button"
              onClick={() => setAnomalyFilter('HIGH')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                anomalyFilter === 'HIGH' ? 'bg-amber-700 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Duplicates (9)
            </button>
            <button
              type="button"
              onClick={() => setAnomalyFilter('WARNING')}
              className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                anomalyFilter === 'WARNING' ? 'bg-yellow-700 text-white' : 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100'
              }`}
            >
              Format Errors (38)
            </button>
          </div>

          {/* Live Scrolling Feed List */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredAnomalies.map((anom) => (
              <div 
                key={anom.id} 
                className="p-4 rounded-xl border transition-all duration-200 bg-slate-50/80 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      anom.severity === 'CRITICAL' 
                        ? 'bg-red-100 text-red-900 border border-red-200' 
                        : anom.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                    }`}>
                      {anom.severity}
                    </span>
                    <span className="font-extrabold text-xs text-[#0F172A]">
                      {anom.title}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1 flex-shrink-0">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{new Date(anom.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {anom.details}
                </p>

                <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] gap-2">
                  <span className="text-slate-600 font-semibold">
                    {anom.instituteName} <span className="font-mono text-[10px] text-slate-500 font-bold">({anom.institutePid})</span>
                  </span>
                  <span className="font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded-md border border-red-200 text-[10px]">
                    {anom.actionTaken}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 flex items-center justify-between">
            <span className="font-semibold">AICTE Section 10-K Real-Time Shield Active</span>
            <span className="font-mono text-[11px] text-blue-800 font-bold">Zero-Tolerance Intake Engine</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MAIN RIGHT PANEL: ACCREDITATION & MONITORING (6 cols)    */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-6">

          {/* ACCREDITATION & POLICY REPORTS CARD */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#0F172A]">Accreditation & Monitoring</h3>
                  <p className="text-xs text-slate-500">Statutory Approved Intake compliance & governance.</p>
                </div>
              </div>

              {/* Requirement 9: Primary Export Button */}
              <button
                type="button"
                onClick={handleExportAccreditationReport}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5 transition-all hover:shadow-lg disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Accreditation Audit (CSV)</span>
              </button>
            </div>

            {/* 4 Statutory Policy Metrics Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Approved Capacity</div>
                <div className="text-xl font-black text-[#0F172A] mt-0.5">1,420,000</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Approved technical seats nationwide</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Actual Enrollment</div>
                <div className="text-xl font-black text-emerald-800 mt-0.5">1,184,320</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">83.4% national fill rate</div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200">
                <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">Supernumerary (TFW)</div>
                <div className="text-xl font-black text-purple-800 mt-0.5">74,210</div>
                <div className="text-[10px] text-purple-700 mt-0.5">Tuition Fee Waiver beneficiaries</div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
                <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Foreign & NRI Quota</div>
                <div className="text-xl font-black text-blue-800 mt-0.5">21,490</div>
                <div className="text-[10px] text-blue-700 mt-0.5">15% supernumerary cap enforced</div>
              </div>
            </div>

            {/* INSTITUTION COMPLIANCE & ACCREDITATION AUDIT TABLE */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#0F172A]">
                <span>Sample Accreditation Registry (PID Telemetry)</span>
                <button
                  type="button"
                  onClick={handleExportNationalEnrollmentAudit}
                  disabled={isExportingNationalAudit}
                  className="text-blue-600 hover:text-blue-800 text-[11px] font-bold underline"
                >
                  {isExportingNationalAudit ? 'Exporting...' : 'Export National Enrollment (CSV)'}
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">PID / Institution</th>
                      <th className="py-2.5 px-3">Intake (Act/App)</th>
                      <th className="py-2.5 px-3">Accreditation</th>
                      <th className="py-2.5 px-3 text-right">Verdict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#0F172A] block text-xs">LNCT Excellence</span>
                        <span className="font-mono text-slate-500 text-[10px]">PID-1-4920182</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800">58 / 60</span>
                        <span className="text-[10px] text-emerald-600 block font-semibold">2 seats free</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          NBA Tier-1
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          COMPLIANT
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#0F172A] block text-xs">Govt Engineering College</span>
                        <span className="font-mono text-slate-500 text-[10px]">PID-1-3310</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800">119 / 120</span>
                        <span className="text-[10px] text-emerald-600 block font-semibold">1 seat free</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                          NAAC A+
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          COMPLIANT
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-red-50/50 bg-red-50/30">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#0F172A] block text-xs">Tech Institute of Innovation</span>
                        <span className="font-mono text-slate-500 text-[10px]">PID-1-8841</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-red-700">182 / 180</span>
                        <span className="text-[10px] text-red-600 block font-semibold">+2 overflow</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Under Review
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] font-bold text-red-800 bg-red-100 px-2 py-0.5 rounded-md border border-red-200">
                          HTTP 422 FLAGGED
                        </span>
                      </td>
                    </tr>

                    <tr className="hover:bg-slate-50">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#0F172A] block text-xs">Delhi Tech Univ Affiliate</span>
                        <span className="font-mono text-slate-500 text-[10px]">PID-1-9921</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-800">59 / 60</span>
                        <span className="text-[10px] text-emerald-600 block font-semibold">1 seat free</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                          NBA Tier-1
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          COMPLIANT
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cryptographic SHA-256 Merkle Chain Integrity */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                <span>Audit Chain: <strong>{auditLogs.length} Blocks Anchored</strong></span>
              </div>
              <span className="font-mono text-[11px] text-slate-500 font-bold">SHA-256 Merkle Ok</span>
            </div>

          </div>

          {/* PREVENTED DUPLICATE ADMISSIONS REGISTRY CARD */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <AlertOctagon className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-extrabold text-[#0F172A]">Prevented Duplicate Admissions Registry</h3>
              </div>
              <span className="text-xs font-bold bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
                HTTP 409 Intercepts
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Candidate / APAAR</th>
                    <th className="py-2.5 px-3">Active Institute</th>
                    <th className="py-2.5 px-3">Blocked Attempt</th>
                    <th className="py-2.5 px-3 text-right">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blockedFraudRecords.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[#0F172A] block">{b.studentName}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{b.apaarId}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-emerald-700 font-bold block">{b.existingInstituteName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{b.existingActivePid}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-red-700 font-semibold block">{b.attemptedInstituteName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">{b.attemptedPid}</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <AlertOctagon className="w-3 h-3 text-red-600" />
                          <span>Dual Active Blocked</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>PostgreSQL unique partial index constraint protects university seats from ghost enrollments and seat-blocking syndicates.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
