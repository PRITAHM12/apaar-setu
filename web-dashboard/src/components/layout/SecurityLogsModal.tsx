import React, { useState } from 'react';
import { ShieldCheck, X, CheckCircle2, AlertTriangle, Lock, UserPlus } from 'lucide-react';
import { useAuthRBAC } from '../../context/AuthRBACContext';

interface SecurityLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityLogsModal: React.FC<SecurityLogsModalProps> = ({ isOpen, onClose }) => {
  const { auditLogs } = useAuthRBAC();
  const [filter, setFilter] = useState<'ALL' | 'BLOCKED' | 'VERIFIED'>('ALL');

  if (!isOpen) return null;

  const filteredLogs = auditLogs.filter(log => {
    if (filter === 'BLOCKED') return log.httpStatus === 409 || log.httpStatus === 422 || log.httpStatus === 403;
    if (filter === 'VERIFIED') return log.httpStatus === 200 || log.httpStatus === 201;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">National Security & Audit Logs</h3>
              <p className="text-xs text-slate-500">Immutable ledger of student admissions, employer verifications, and blocked dual enrollments</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'ALL' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Activities ({auditLogs.length})
            </button>
            <button
              onClick={() => setFilter('BLOCKED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'BLOCKED' 
                  ? 'bg-rose-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Blocked Fraud & Conflicts
            </button>
            <button
              onClick={() => setFilter('VERIFIED')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === 'VERIFIED' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Verified Transactions
            </button>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            SHA-256 Merkle Chain Active
          </span>
        </div>

        {/* Logs List */}
        <div className="p-6 overflow-y-auto space-y-3 divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No activity recorded for this filter.</p>
            </div>
          ) : (
            filteredLogs.slice().reverse().map((log) => {
              const isBlocked = log.httpStatus === 409 || log.httpStatus === 422 || log.httpStatus === 403;
              const isSuccess = log.httpStatus === 200 || log.httpStatus === 201;

              return (
                <div key={log.id} className="pt-3 first:pt-0 flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isBlocked ? 'bg-rose-100 text-rose-600' : isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {isBlocked ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : log.eventType.includes('CONSENT') ? (
                        <Lock className="w-4 h-4" />
                      ) : log.eventType.includes('ONBOARD') ? (
                        <UserPlus className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {log.eventType.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                          isBlocked ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isBlocked ? 'Security Intercept' : 'Success'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {log.details}
                      </p>
                      <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-400">
                        <span>Actor: <strong className="text-slate-600">{log.actorEmail}</strong></span>
                        <span>•</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Digital Signature Badge */}
                  <div className="text-right flex-shrink-0">
                    <span 
                      className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200"
                      title={log.currentHash}
                    >
                      Sig: {log.currentHash.slice(0, 10)}...
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Protected under AICTE Zero-Trust Guidelines & DPDP Act 2023</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
};
