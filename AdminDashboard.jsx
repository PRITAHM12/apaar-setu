import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Supabase Client Initialization
// ============================================================================
const SUPABASE_URL = process.env?.REACT_APP_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const SUPABASE_ANON_KEY = process.env?.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const AdminDashboard = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [quotaViolationAlert, setQuotaViolationAlert] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [stats, setStats] = useState({
    collegeName: 'Lakshmi Narain College of Technology & Excellence, Bhopal',
    collegeId: 'COL-LNCTE-001',
    approvedQuota: 60,
    currentApproved: 58,
    pendingVerification: 0
  });

  // --------------------------------------------------------------------------
  // Supabase Real-Time Subscription: Listen to INSERT on audit_logs
  // --------------------------------------------------------------------------
  useEffect(() => {
    const fetchInitialLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(20);

        if (!error && data) {
          setAuditLogs(data);
        } else {
          setAuditLogs([
            {
              log_id: 'init-seed-1',
              user_id: 'SYSTEM_GENESIS',
              action: 'LEDGER_INITIALIZED',
              ip_address: '127.0.0.1',
              timestamp: new Date().toISOString(),
              metadata: { approvedQuota: 60 }
            }
          ]);
        }
      } catch (err) {
        console.warn('[SUPABASE FETCH NOTICE]', err.message);
      }
    };

    fetchInitialLogs();

    const channel = supabase
      .channel('realtime:audit_logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'audit_logs'
        },
        (payload) => {
          const newRecord = payload.new;
          console.log('⚡ [REALTIME AUDIT LOG RECEIVED]:', newRecord);

          setAuditLogs((prev) => [newRecord, ...prev]);

          // THE BLOCKER ALERT:
          const isViolation =
            newRecord.action === 'INTAKE_QUOTA_EXCEEDED_VIOLATION' ||
            newRecord.metadata?.status_code === 422 ||
            newRecord.action?.includes('VIOLATION');

          if (isViolation) {
            setQuotaViolationAlert({
              id: newRecord.log_id || Date.now(),
              action: newRecord.action,
              ip: newRecord.ip_address,
              user: newRecord.user_id,
              time: newRecord.timestamp || new Date().toISOString(),
              details: newRecord.metadata || {
                message: 'STATUTORY VIOLATION BLOCKED: Total intake exceeds sanctioned quota limit.'
              }
            });
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsSubscribed(true);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const dismissAlert = () => setQuotaViolationAlert(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* REAL-TIME RED WARNING BANNER (TRIGGERED BY 422 INTAKE BLOCKER) */}
      {quotaViolationAlert && (
        <div
          role="alert"
          className="sticky top-0 z-50 bg-rose-600 text-white px-6 py-4 shadow-xl border-b-4 border-rose-800 animate-bounce-once flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div className="flex items-start space-x-3.5">
            <span className="text-2xl mt-0.5">🚨</span>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-rose-900 text-rose-100 border border-rose-700">
                  HTTP 422 Unprocessable Entity
                </span>
                <span className="text-xs font-semibold text-rose-200">
                  Real-time Anti-Fraud Anomaly Detected
                </span>
              </div>
              <h2 className="text-lg font-black tracking-tight text-white mt-1">
                STATUTORY INTAKE VIOLATION DETECTED & BLOCKED!
              </h2>
              <p className="text-sm text-rose-100 mt-0.5 leading-snug">
                Institution <span className="font-bold underline">{quotaViolationAlert.details?.college_id || 'COL-LNCTE-001'}</span> attempted 
                to upload a CSV batch that exceeds statutory quota of {quotaViolationAlert.details?.approved_intake_quota || 60} students. 
                Transaction aborted instantly by Pandas Automation Engine.
              </p>
              <div className="mt-2 text-xs text-rose-200 font-mono flex flex-wrap gap-x-4">
                <span>Origin IP: {quotaViolationAlert.ip}</span>
                <span>User: {quotaViolationAlert.user}</span>
                <span>Timestamp: {new Date(quotaViolationAlert.time).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end md:self-center">
            <button
              onClick={() => window.open('/audit-report', '_blank')}
              className="bg-white text-rose-700 hover:bg-rose-50 text-xs font-bold px-3 py-2 rounded-lg transition-colors shadow-sm"
            >
              Export Incident Dossier
            </button>
            <button
              onClick={dismissAlert}
              className="bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
            >
              Acknowledge & Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Top Header */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                National Academic Regulatory Portal
              </span>
              <span className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Supabase Real-Time {isSubscribed ? 'Connected' : 'Connecting...'}</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              AICTE Regulatory Governance & Anomaly Hub
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live statutory compliance monitoring across universities & affiliated colleges under National Education Policy 2020.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Monitored Institution</span>
            <span className="text-sm font-bold text-slate-900 block">{stats.collegeName}</span>
            <span className="text-xs font-mono text-slate-500 block">PID: {stats.collegeId}</span>
          </div>
        </div>

        {/* Real-Time Intake Quota Tracker */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sanctioned Quota (Cap)</span>
            <div className="text-3xl font-black text-slate-900 mt-2">{stats.approvedQuota}</div>
            <span className="text-xs text-slate-500 block mt-1">Statutory AICTE Approved Seats</span>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active / Approved</span>
            <div className="text-3xl font-black text-blue-700 mt-2">
              {stats.currentApproved}{' '}
              <span className="text-sm font-normal text-slate-400">/ {stats.approvedQuota}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(stats.currentApproved / stats.approvedQuota) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Available Headroom</span>
            <div className="text-3xl font-black text-emerald-600 mt-2">
              {stats.approvedQuota - stats.currentApproved}{' '}
              <span className="text-sm font-normal text-slate-400">Seats Remaining</span>
            </div>
            <span className="text-xs text-amber-600 font-semibold block mt-1">
              Attempting &gt; {stats.approvedQuota - stats.currentApproved} will trigger immediate 422 Blocker
            </span>
          </div>
        </div>

        {/* Real-Time Immutable Audit Log Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Live Immutable Audit Ledger (`public.audit_logs`)
              </h2>
              <p className="text-xs text-slate-500">
                Pushed directly via Supabase WebSocket on every database insertion
              </p>
            </div>
            <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-3 py-1 rounded-full">
              {auditLogs.length} Events Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Action / Event</th>
                  <th className="px-6 py-3">User ID</th>
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Audit Details</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-400 font-sans">
                      No audit events recorded yet. Waiting for realtime stream...
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log, idx) => {
                    const isViolation =
                      log.action?.includes('VIOLATION') || log.action?.includes('BLOCKED');
                    return (
                      <tr
                        key={log.log_id || idx}
                        className={isViolation ? 'bg-rose-50/70 hover:bg-rose-50' : 'hover:bg-slate-50'}
                      >
                        <td className="px-6 py-3.5 text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-6 py-3.5 font-bold">
                          <span
                            className={`px-2 py-1 rounded-md text-[11px] ${
                              isViolation
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-700">{log.user_id}</td>
                        <td className="px-6 py-3.5 text-slate-500">{log.ip_address}</td>
                        <td className="px-6 py-3.5 text-slate-600 truncate max-w-xs font-sans">
                          {typeof log.metadata === 'object'
                            ? JSON.stringify(log.metadata)
                            : log.metadata || '—'}
                        </td>
                        <td className="px-6 py-3.5 text-right font-sans">
                          {isViolation ? (
                            <span className="font-bold text-rose-600 flex items-center justify-end space-x-1">
                              <span>●</span>
                              <span>BLOCKED</span>
                            </span>
                          ) : (
                            <span className="font-bold text-emerald-600 flex items-center justify-end space-x-1">
                              <span>●</span>
                              <span>RECORDED</span>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
