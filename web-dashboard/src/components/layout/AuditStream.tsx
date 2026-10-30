import React, { useRef, useEffect } from 'react';
import { 
  Terminal, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Copy, 
  Check 
} from 'lucide-react';
import { useAuthRBAC } from '../../context/AuthRBACContext';

export const AuditStream: React.FC = () => {
  const { auditLogs, isAuditDrawerOpen, toggleAuditDrawer } = useAuthRBAC();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  useEffect(() => {
    if (scrollRef.current && isAuditDrawerOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [auditLogs, isAuditDrawerOpen]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 200:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
            <CheckCircle className="w-2.5 h-2.5" /> 200 OK
          </span>
        );
      case 403:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-400 border border-amber-800">
            <Lock className="w-2.5 h-2.5" /> 403 RLS FORBIDDEN
          </span>
        );
      case 409:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-400 border border-red-800">
            <AlertTriangle className="w-2.5 h-2.5" /> 409 DUAL-ENROLL CONFLICT
          </span>
        );
      case 422:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse">
            <ShieldAlert className="w-2.5 h-2.5" /> 422 AI TAMPER ALERT
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <aside 
      aria-label="Security Audit Stream"
      className="fixed bottom-0 left-0 right-0 z-30 transition-all duration-300 shadow-2xl border-t border-slate-800 bg-[#0F172A]"
      style={{ height: isAuditDrawerOpen ? '260px' : '36px' }}
    >
      {/* Drawer Control Header */}
      <div 
        onClick={toggleAuditDrawer}
        className="h-9 px-4 flex items-center justify-between cursor-pointer bg-slate-900/90 hover:bg-slate-800/90 border-b border-slate-800 text-slate-300 select-none"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-semibold tracking-wide text-slate-200">
            ZERO-TRUST AUDIT STREAM (APPEND-ONLY SHA-256 CHAINED LEDGER)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {auditLogs.length} events
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            Status: <span className="text-emerald-400 font-bold">W3C ANCHORED</span>
          </span>
          <button 
            type="button" 
            className="p-1 rounded text-slate-400 hover:text-white"
            aria-label={isAuditDrawerOpen ? 'Collapse audit stream drawer' : 'Expand audit stream drawer'}
          >
            {isAuditDrawerOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Log Content */}
      {isAuditDrawerOpen && (
        <div 
          ref={scrollRef}
          className="h-[224px] overflow-y-auto p-3 font-mono text-xs space-y-2 bg-[#0B1120]"
        >
          {auditLogs.map((log) => {
            const isCopied = copiedId === log.id;
            return (
              <div 
                key={log.id} 
                className="group p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 hover:bg-slate-900 transition flex flex-col md:flex-row md:items-start justify-between gap-2"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] text-slate-500">
                      [{log.timestamp.slice(11, 23)}]
                    </span>
                    {getStatusBadge(log.httpStatus)}
                    <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-800 text-blue-300 font-semibold border border-slate-700">
                      {log.eventType}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {log.actorEmail} ({log.actorRole})
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed pl-1">
                    {log.details}
                  </p>
                </div>

                {/* Event Hash Display & Copy */}
                <div className="flex items-center gap-2 self-start md:self-auto shrink-0 pt-1 md:pt-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">SHA-256 HASH</span>
                    <code className="text-[11px] text-emerald-400/90 font-mono" title={log.currentHash}>
                      {log.currentHash.slice(0, 18)}...
                    </code>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(log.currentHash, log.id);
                    }}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                    title="Copy full cryptographic SHA-256 hash"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};
