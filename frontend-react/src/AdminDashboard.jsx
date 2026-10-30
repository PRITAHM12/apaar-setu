import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://xrwdrvxbzisvexcykye.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_P7h34NrZEjMpBfxJYnnZ9g_hmRwbsnI';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const AdminDashboard = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [quotaViolation, setQuotaViolation] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // 1. Initial snapshot fetch
    const fetchRecentAuditLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('timestamp', { ascending: false })
          .limit(20);

        if (!error && data) {
          setAuditLogs(data);
        }
      } catch (err) {
        console.warn('[SUPABASE FETCH ERROR]', err);
      }
    };

    fetchRecentAuditLogs();

    // 2. Real-time WebSocket subscription to audit_logs
    const channel = supabase
      .channel('realtime:audit_logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'audit_logs' },
        (payload) => {
          const newRecord = payload.new;
          console.log('⚡ [REALTIME INSERT RECEIVED ON audit_logs]:', newRecord);

          setAuditLogs((prev) => [newRecord, ...prev]);

          // Check if Python engine inserted an HTTP 422 quota violation
          const is422Violation =
            newRecord.action === 'INTAKE_QUOTA_EXCEEDED_VIOLATION' ||
            newRecord.metadata?.status_code === 422 ||
            (newRecord.action && newRecord.action.includes('VIOLATION'));

          if (is422Violation) {
            setQuotaViolation({
              id: newRecord.log_id,
              action: newRecord.action,
              ip: newRecord.ip_address,
              user: newRecord.user_id,
              timestamp: newRecord.timestamp,
              details: newRecord.metadata || {},
            });
          }
        }
      )
      .subscribe((status) => {
        setIsSubscribed(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-6">
      {/* ==================================================================== */}
      {/* REAL-TIME 422 RED WARNING BANNER (NO REFRESH REQUIRED)               */}
      {/* ==================================================================== */}
      {quotaViolation && (
        <div
          role="alert"
          className="mb-6 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl border-l-8 border-red-900 flex items-start justify-between animate-bounce"
        >
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-red-950 text-red-200 text-xs px-2 py-0.5 rounded font-black tracking-wider uppercase">
                HTTP 422 UNPROCESSABLE ENTITY
              </span>
              <span className="text-xs text-red-200">
                {new Date(quotaViolation.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <h2 className="text-lg font-black tracking-tight mt-1">
              STATUTORY INTAKE QUOTA EXCEEDED
            </h2>
            <p className="text-sm text-red-100 mt-0.5">
              Institution <strong>{quotaViolation.details?.college_id || 'COL-LNCTE-001'}</strong> attempted batch insertion of{' '}
              <strong>{quotaViolation.details?.attempted_batch_size}</strong> candidates. 
              Sanctioned Quota: <strong>{quotaViolation.details?.approved_intake_quota}</strong> | 
              Currently Active: <strong>{quotaViolation.details?.current_active_enrollments}</strong>.
            </p>
            <p className="text-xs text-red-200 font-mono mt-1">
              Source IP: {quotaViolation.ip} | User: {quotaViolation.user}
            </p>
          </div>
          <button
            onClick={() => setQuotaViolation(null)}
            className="text-xs bg-red-800 hover:bg-red-900 px-3 py-1.5 rounded-lg text-white font-bold transition-colors"
          >
            Acknowledge & Dismiss
          </button>
        </div>
      )}

      {/* HEADER & STREAM STATUS */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">APAAR-Setu Real-Time Governance Console</h1>
          <p className="text-xs text-slate-500">Live PostgreSQL CDC stream via Supabase WebSockets</p>
        </div>
        <div className="flex items-center space-x-2">
          <span
            className={`w-3 h-3 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}
          />
          <span className="text-xs font-bold text-slate-700">
            {isSubscribed ? 'WEBSOCKET ACTIVE' : 'CONNECTING...'}
          </span>
        </div>
      </div>

      {/* AUDIT LOG TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-100 text-slate-700 uppercase border-b border-slate-200">
            <tr>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5">Action</th>
              <th className="p-3.5">User</th>
              <th className="p-3.5">IP Address</th>
              <th className="p-3.5">Metadata Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditLogs.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-6 text-center text-slate-400 font-sans">
                  No audit logs recorded yet. Waiting for realtime stream...
                </td>
              </tr>
            ) : (
              auditLogs.map((log, idx) => (
                <tr
                  key={log.log_id || idx}
                  className={log.action?.includes('VIOLATION') ? 'bg-red-50 text-red-900 font-bold' : ''}
                >
                  <td className="p-3.5 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="p-3.5">{log.action}</td>
                  <td className="p-3.5">{log.user_id}</td>
                  <td className="p-3.5">{log.ip_address}</td>
                  <td className="p-3.5 text-slate-600 truncate max-w-xs">
                    {typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : log.metadata}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
