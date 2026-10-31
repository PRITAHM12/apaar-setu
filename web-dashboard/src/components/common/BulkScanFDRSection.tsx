import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCheck2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Copy, 
  Check, 
  Search
} from 'lucide-react';

export interface ScannedFDRRecord {
  id: string;
  fdrNumber: string;
  docType: 'FDR_LIEN' | 'BANK_GUARANTEE' | 'JOINT_DEPOSIT' | 'ENDOWMENT_RESERVE';
  docTypeLabel: string;
  bankName: string;
  branchName: string;
  beneficiary: string;
  amountInr: number;
  formattedAmount: string;
  merkleHash: string;
  scannedAt: string;
  maturityDate: string;
  validationStatus: 'VERIFIED_GENUINE' | 'PENDING_CLEARANCE' | 'ANOMALY_FLAGGED';
  validationMessage: string;
  sfmsReference: string;
}

const INITIAL_FDR_RECORDS: ScannedFDRRecord[] = [
  {
    id: 'FDR-REC-001',
    fdrNumber: 'FDR-2026-SBI-89211',
    docType: 'FDR_LIEN',
    docTypeLabel: 'Fixed Deposit Receipt (Lien Marked)',
    bankName: 'State Bank of India',
    branchName: 'Bhopal Main Branch (SBI-00028)',
    beneficiary: 'Member Secretary, AICTE New Delhi & LNCTE Joint Lien',
    amountInr: 15000000,
    formattedAmount: '₹ 1,50,00,000',
    merkleHash: '0x8f2a74c1092e8471b028819a571029ba81c391aa',
    scannedAt: '2026-10-31 10:14:22',
    maturityDate: '31-Mar-2029 (Active)',
    validationStatus: 'VERIFIED_GENUINE',
    validationMessage: 'Lien Marked to AICTE • Auto-Renew Enabled',
    sfmsReference: 'SFMS-760COV-SBI-991204'
  },
  {
    id: 'FDR-REC-002',
    fdrNumber: 'BG-2026-HDFC-90234',
    docType: 'BANK_GUARANTEE',
    docTypeLabel: 'Performance Security e-BG',
    bankName: 'HDFC Bank Limited',
    branchName: 'Connaught Place Branch, New Delhi',
    beneficiary: 'Directorate of Technical Education & AICTE Apex Node',
    amountInr: 7500000,
    formattedAmount: '₹ 75,00,000',
    merkleHash: '0x3b11e9a4f20819c42e8b10f92a3d4e5f6a90f23d',
    scannedAt: '2026-10-31 09:42:08',
    maturityDate: '15-Dec-2028 (Active)',
    validationStatus: 'VERIFIED_GENUINE',
    validationMessage: 'NeSL Digital e-BG Verified • Unencumbered',
    sfmsReference: 'NESL-EBG-HDFC-882103'
  },
  {
    id: 'FDR-REC-003',
    fdrNumber: 'FDR-2025-PNB-44102',
    docType: 'JOINT_DEPOSIT',
    docTypeLabel: 'Institutional Corpus Reserve',
    bankName: 'Punjab National Bank',
    branchName: 'TT Nagar Branch, Bhopal',
    beneficiary: 'AICTE Joint Account Escrow • PID-1-4920182',
    amountInr: 20000000,
    formattedAmount: '₹ 2,00,00,000',
    merkleHash: '0x7e44a19c5b2091a41c5d6e7f8a9b0c1d2e812d44',
    scannedAt: '2026-10-30 16:30:45',
    maturityDate: '28-Feb-2027 (Active)',
    validationStatus: 'VERIFIED_GENUINE',
    validationMessage: 'Mandatory Institutional Corpus Fully Anchored',
    sfmsReference: 'SFMS-760COV-PNB-449102'
  },
  {
    id: 'FDR-REC-004',
    fdrNumber: 'FDR-2024-CANARA-77291',
    docType: 'ENDOWMENT_RESERVE',
    docTypeLabel: 'Endowment Reserve Certificate',
    bankName: 'Canara Bank',
    branchName: 'Parliament Street, New Delhi',
    beneficiary: 'All India Council for Technical Education',
    amountInr: 5000000,
    formattedAmount: '₹ 50,00,000',
    merkleHash: '0x9c02d18471b028819a571029ba81c391aa55e102',
    scannedAt: '2026-10-30 14:12:10',
    maturityDate: '10-Nov-2026 (Expiring in 10 Days)',
    validationStatus: 'PENDING_CLEARANCE',
    validationMessage: 'Renewal Telemetry In Progress via Bank SFMS Gateway',
    sfmsReference: 'SFMS-760COV-CAN-119283'
  },
  {
    id: 'FDR-REC-005',
    fdrNumber: 'BG-2026-ICICI-11094',
    docType: 'BANK_GUARANTEE',
    docTypeLabel: 'Supernumerary Seat Security Deposit',
    bankName: 'ICICI Bank Limited',
    branchName: 'Corporate Banking Unit, Bandra Kurla Complex',
    beneficiary: 'LNCTE Bhopal • Reserved Foreign National Quota',
    amountInr: 12000000,
    formattedAmount: '₹ 1,20,00,000',
    merkleHash: '0x1f89c42e8b10f92a3d4e5f6a7b8c9d0e1f2ae27a',
    scannedAt: '2026-10-29 11:05:30',
    maturityDate: '30-Jun-2029 (Active)',
    validationStatus: 'ANOMALY_FLAGGED',
    validationMessage: 'Duplicate FDR Number Flagged: Conflicting Lien on Second Institution',
    sfmsReference: 'SFMS-ALERT-ICICI-00192'
  }
];

export interface BulkScanFDRSectionProps {
  roleVariant: 'ROLE_INST_NODAL' | 'ROLE_VERIFIER';
}

export const BulkScanFDRSection: React.FC<BulkScanFDRSectionProps> = ({ roleVariant }) => {
  const [fdrRecords, setFdrRecords] = useState<ScannedFDRRecord[]>(INITIAL_FDR_RECORDS);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processSuccessMessage, setProcessSuccessMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    triggerSimulatedBatchUpload('Dragged_Batch_FDR_Archive.zip (3 Certificates)');
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileName = e.target.files[0].name;
      triggerSimulatedBatchUpload(fileName);
    }
  };

  const triggerSimulatedBatchUpload = (sourceName: string) => {
    setIsProcessing(true);
    setProcessSuccessMessage(null);

    setTimeout(() => {
      const newRecord: ScannedFDRRecord = {
        id: `FDR-REC-${Date.now().toString().slice(-4)}`,
        fdrNumber: `FDR-2026-UNION-${Math.floor(10000 + Math.random() * 90000)}`,
        docType: 'FDR_LIEN',
        docTypeLabel: 'Fixed Deposit Receipt (Lien Marked)',
        bankName: 'Union Bank of India',
        branchName: 'Corporate Hub New Delhi',
        beneficiary: 'Member Secretary AICTE & Nodal Institute Joint Lien',
        amountInr: 10000000,
        formattedAmount: '₹ 1,00,00,000',
        merkleHash: `0x${Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        scannedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        maturityDate: '31-Dec-2029 (Active)',
        validationStatus: 'VERIFIED_GENUINE',
        validationMessage: 'Instant Merkle Proof Validated • SFMS 760COV Live Lien Confirmed',
        sfmsReference: `SFMS-760COV-UBI-${Math.floor(100000 + Math.random() * 900000)}`
      };

      setFdrRecords(prev => [newRecord, ...prev]);
      setIsProcessing(false);
      setProcessSuccessMessage(`Batch scan complete for [${sourceName}]. Document cryptographic hash calculated and anchored to AICTE Gazette ledger.`);
    }, 1200);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  const filteredRecords = fdrRecords.filter(r => 
    r.fdrNumber.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.bankName.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.docTypeLabel.toLowerCase().includes(filterQuery.toLowerCase()) ||
    r.validationMessage.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      
      {/* 1. Header with Badge & Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
              Bulk Scan Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">
              AICTE Section 11-A Security Deposit Protocol
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center space-x-2">
            <span>Bulk Scan: FDR & Security Deposit Document Validation</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {roleVariant === 'ROLE_INST_NODAL'
              ? 'Institutional Nodal Hub batch ingestion tool: verify institutional FDR endorsements, e-BGs, and AICTE mandatory lien covenants.'
              : 'Corporate & Regulatory verification console: batch audit high-value security deposit guarantees and forensic liens.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>SFMS 760COV Verified</span>
          </span>
        </div>
      </div>

      {/* 2. Drag & Drop File Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-7 text-center transition-all cursor-pointer ${
          isDragging 
            ? 'border-blue-600 bg-blue-50/80 shadow-md scale-[1.005]' 
            : 'border-slate-300 hover:border-blue-500 bg-slate-50/60 hover:bg-slate-50'
        }`}
        onClick={handleBrowseClick}
      >
        <input 
          ref={fileInputRef} 
          type="file" 
          multiple 
          accept=".pdf,.tiff,.tif,.xml,.csv,.png,.jpg" 
          onChange={handleFileSelected} 
          className="hidden" 
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
            isProcessing ? 'bg-blue-600 text-white animate-bounce' : 'bg-blue-100 text-blue-700'
          }`}>
            <UploadCloud className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Drag & Drop batch FDR certificates, e-BGs, or financial archives here
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl mx-auto">
              Supports multi-file scanned PDF, TIFF, NeSL structured XML, and SFMS structured messages (Max 50 documents / 250MB per batch).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <button
              type="button"
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                handleBrowseClick();
              }}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-2xs transition-all"
            >
              Browse Files
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={(e) => {
                e.stopPropagation();
                triggerSimulatedBatchUpload('Sample_AICTE_FDR_Batch_Package.zip');
              }}
              className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Cryptographic Merkle Scan...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>⚡ Simulate Batch Scan (Auto-Verify)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {processSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center space-x-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{processSuccessMessage}</span>
        </div>
      )}

      {/* 3. Static Mock Data Table: Recently Scanned FDR & Security Deposit Documents */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-extrabold text-slate-900">
              Recently Scanned FDR & Security Deposit Ledger
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {filteredRecords.length} Documents
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter by FDR#, Bank, or Status..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 font-sans"
            />
          </div>
        </div>

        {/* The Data Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-3 px-3.5">FDR / BG Ref & Type</th>
                <th className="py-3 px-3.5">Issuing Bank & Branch</th>
                <th className="py-3 px-3.5">Beneficiary / Scoped Lien</th>
                <th className="py-3 px-3.5 text-right">Amount (₹)</th>
                <th className="py-3 px-3.5">Merkle Hash / SFMS</th>
                <th className="py-3 px-3.5">Validation Status</th>
                <th className="py-3 px-3.5">Trust Status</th>
                <th className="py-3 px-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((rec) => {
                const isVerified = rec.validationStatus === 'VERIFIED_GENUINE';
                const isPending = rec.validationStatus === 'PENDING_CLEARANCE';
                const isFlagged = rec.validationStatus === 'ANOMALY_FLAGGED';

                return (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* 1. FDR Number & Type */}
                    <td className="py-3 px-3.5">
                      <div className="font-mono font-bold text-slate-900">{rec.fdrNumber}</div>
                      <div className="text-[11px] text-slate-500 font-medium">{rec.docTypeLabel}</div>
                    </td>

                    {/* 2. Issuing Bank */}
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-800">{rec.bankName}</div>
                      <div className="text-[10px] text-slate-500">{rec.branchName}</div>
                    </td>

                    {/* 3. Beneficiary */}
                    <td className="py-3 px-3.5 max-w-[200px] truncate" title={rec.beneficiary}>
                      <span className="font-medium text-slate-700">{rec.beneficiary}</span>
                    </td>

                    {/* 4. Amount */}
                    <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">
                      {rec.formattedAmount}
                    </td>

                    {/* 5. Merkle Hash */}
                    <td className="py-3 px-3.5 font-mono text-[10px]">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-slate-600 truncate max-w-[100px]" title={rec.merkleHash}>
                          {rec.merkleHash.slice(0, 10)}...{rec.merkleHash.slice(-6)}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyHash(rec.merkleHash)}
                          className="text-slate-400 hover:text-slate-800 transition-colors"
                          title="Copy Full SHA-256 Hash"
                        >
                          {copiedHash === rec.merkleHash ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[9px] text-slate-400">{rec.sfmsReference}</span>
                    </td>

                    {/* 6. Validation Status */}
                    <td className="py-3 px-3.5">
                      <div className="space-y-0.5">
                        {isVerified && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>VERIFIED GENUINE</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>PENDING BANK ACK</span>
                          </span>
                        )}
                        {isFlagged && (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>ANOMALY FLAGGED</span>
                          </span>
                        )}
                        <p className="text-[10px] text-slate-500 leading-tight">
                          {rec.validationMessage}
                        </p>
                      </div>
                    </td>

                    {/* Trust Status */}
                    <td className="py-3 px-3.5">
                      {isFlagged ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white border border-rose-700 shadow-xs animate-pulse">
                          <AlertTriangle className="w-3 h-3 text-amber-300" />
                          <span>FLAGGED</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>CLEARED</span>
                        </span>
                      )}
                    </td>

                    {/* 7. Action Button */}
                    <td className="py-3 px-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => alert(`Certificate Audit Receipt:\n\nFDR Ref: ${rec.fdrNumber}\nBank: ${rec.bankName}\nAmount: ${rec.formattedAmount}\nMerkle Proof: ${rec.merkleHash}\nSFMS Message: ${rec.sfmsReference}\nValidation: ${rec.validationStatus}\n\nCryptographic verification confirmed against AICTE Reserve Gazette.`)}
                        className="px-2.5 py-1 rounded-lg border border-slate-300 hover:border-blue-600 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-[10px] transition-all"
                      >
                        Audit Proof
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
