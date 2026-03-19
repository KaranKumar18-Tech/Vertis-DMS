import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Info, 
  Eye, 
  Calendar,
  Layers,
  CheckCircle2,
  Lock,
  Send,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle,
  Loader2,
  FileText,
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { useApprovals } from '../../context/ApprovalContext';

export const DistributionMaster = () => {
  const navigate = useNavigate();
  const { submitForApproval, rejectedItems, clearRejection, approvedItems, notifications, isItemPending } = useApprovals();
  const [rate, setRate] = useState('0.1250');
  const [fy, setFy] = useState('FY 2025-26');
  const [quarter, setQuarter] = useState('Q3');
  const [distErrors, setDistErrors] = useState<Record<string, string>>({});
  const [duplicateConfirmed, setDuplicateConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [distMasterSubmitted, setDistMasterSubmitted] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [showWithdrawToast, setShowWithdrawToast] = useState(false);
  const [isEditingWithdrawn, setIsEditingWithdrawn] = useState(false);
  const [rateEditable, setRateEditable] = useState(false);
  const [showEditBanner, setShowEditBanner] = useState(false);
  const [step, setStep] = useState(1);
  const [fileSelected, setFileSelected] = useState<{name: string, size: string} | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'complete'>('idle');
  const [showPreProcess, setShowPreProcess] = useState(false);
  const [preProcessStep, setPreProcessStep] = useState(0);
  const [uploadKey, setUploadKey] = useState(0);
  const [uploadTime, setUploadTime] = useState('');
  const [highlightedQuarter, setHighlightedQuarter] = useState<string | null>(null);
  
  const distMasterPending = isItemPending('distribution-master', quarter, fy);
  const distMasterApproved = approvedItems.includes(`distribution-master-${quarter}-${fy.replace(' ', '')}`);
  const distMasterRejected = rejectedItems[`distribution-master-${quarter}-${fy.replace(' ', '')}`];
  
  const isQuarterApproved = (fy: string, quarter: string) => {
    // Check processed and locked quarters
    const processedAndLockedQuarters = [
      'Q1-FY2022-23', 'Q2-FY2022-23', 'Q3-FY2022-23', 'Q4-FY2022-23',
      'Q1-FY2023-24', 'Q2-FY2023-24', 'Q3-FY2023-24', 'Q4-FY2023-24',
      'Q1-FY2024-25', 'Q2-FY2024-25', 'Q3-FY2024-25', 'Q4-FY2024-25',
      'Q1-FY2025-26', 'Q2-FY2025-26'
    ];
    const key = `${quarter}-${fy.replace(' ', '')}`;
    if (processedAndLockedQuarters.includes(key)) 
      return 'historical';
    
    // Check current demo quarter approved
    if (fy === 'FY 2025-26' && quarter === 'Q3') {
      const itemId = `distribution-master-${quarter}-${fy.replace(' ', '')}`;
      if (approvedItems.includes(itemId))
        return 'approved';
      if (isItemPending('distribution-master', quarter, fy))
        return 'pending';
      if (rejectedItems[itemId])
        return 'rejected';
    }
    
    return 'open';
  };

  const quarterStatus = isQuarterApproved(fy, quarter);
  
  const processedAndLockedQuarters = [
    'Q1-FY2022-23', 'Q2-FY2022-23', 'Q3-FY2022-23', 'Q4-FY2022-23',
    'Q1-FY2023-24', 'Q2-FY2023-24', 'Q3-FY2023-24', 'Q4-FY2023-24',
    'Q1-FY2024-25', 'Q2-FY2024-25', 'Q3-FY2024-25', 'Q4-FY2024-25',
    'Q1-FY2025-26', 'Q2-FY2025-26'
  ];
  
  const approvedQuarters = [
    'Q1-FY2022-23', 'Q2-FY2022-23', 'Q3-FY2022-23', 'Q4-FY2022-23',
    'Q1-FY2023-24', 'Q2-FY2023-24', 'Q3-FY2023-24', 'Q4-FY2023-24',
    'Q1-FY2024-25', 'Q2-FY2024-25', 'Q3-FY2024-25', 'Q4-FY2024-25',
    'Q1-FY2025-26', 'Q2-FY2025-26'
  ];

  const selectedKey = `${quarter}-${fy.replace(' ', '')}`;
  const isDuplicate = approvedQuarters.includes(selectedKey);
  const isLocked = processedAndLockedQuarters.includes(selectedKey);
  
  const isDistMasterApproved = approvedItems.includes(`distribution-master-${quarter}-${fy.replace(' ', '')}`);
  const distMasterNotif = notifications.find(
    n => n.itemId.startsWith('distribution-master') && n.type === 'approval'
  );

  const distMasterRejection = rejectedItems[`distribution-master-${quarter}-${fy.replace(' ', '')}`];
  const [entries, setEntries] = useState([
    { fy: 'FY 2025-26', quarter: 'Q1', rate: '0.1250', by: 'Admin', on: '01 Apr 2025', status: 'Approved', approvedBy: 'Rahul Sharma', approvedOn: '02 Apr 2025' },
    { fy: 'FY 2025-26', quarter: 'Q2', rate: '0.1300', by: 'Admin', on: '01 Jul 2025', status: 'Approved', approvedBy: 'Rahul Sharma', approvedOn: '03 Jul 2025' },
    { fy: 'FY 2025-26', quarter: 'Q3', rate: '0.1250', by: 'Ashish Ranjan', on: '28 Feb 2026', status: 'Pending Approval' },
  ]);

  const validateRate = (value: string) => {
    if (!value) return 'Unit rate is required';
    if (isNaN(Number(value))) return 'Unit rate must be a valid number';
    if (parseFloat(value) <= 0) return 'Unit rate must be greater than zero';
    if (parseFloat(value) >= 10) return 'Unit rate seems unusually high. Please verify.';
    const decimalPart = value.toString().split('.')[1];
    if (!decimalPart || decimalPart.length !== 4)
      return 'Unit rate must have exactly 4 decimal places (e.g. 0.1250)';
    return null;
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow numeric input with max 4 decimal places
    if (value === '' || /^\d*\.?\d{0,4}$/.test(value)) {
      setRate(value);
      if (distErrors.rate) {
        const newErrors = { ...distErrors };
        delete newErrors.rate;
        setDistErrors(newErrors);
      }
    }
  };

  const handleSubmitClick = () => {
    setShowModal(true);
  };

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
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileSelected({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileSelected({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      });
    }
  };

  const handleUpload = () => {
    if (!fileSelected) return;
    
    setShowPreProcess(true);
    setPreProcessStep(0);
    
    setTimeout(() => setPreProcessStep(1), 800);
    setTimeout(() => setPreProcessStep(2), 1600);
    
    setTimeout(() => {
      setShowPreProcess(false);
      setValidationState('complete');
      setStep(3);
      setUploadTime(new Date().toLocaleString());
    }, 2400);
  };

  const handleConfirmSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (distMasterRejection) {
        clearRejection(`distribution-master-${quarter}-${fy.replace(' ', '')}`);
      }
      submitForApproval({
        id: `distribution-master-${quarter}-${fy.replace(' ', '')}`,
        type_key: 'distribution-master',
        quarter: quarter,
        fy: fy,
        type: 'Distribution Master',
        title: `Distribution Master — ${quarter} ${fy}`,
        stats: [
          { label: 'FINANCIAL YEAR', value: fy, color: '#8B1A1A' },
          { label: 'QUARTER', value: quarter, color: '#1A1A1A' },
          { label: 'UNIT RATE', value: rate, color: '#8B1A1A' }
        ],
        timer: 'Just submitted',
        gridCols: 3
      });
      setDistMasterSubmitted(true);
      setIsLoading(false);
      setShowModal(false);
      setShowSuccess(true);
      setShowEditBanner(false);
      setRateEditable(false);
      // Add to entries
      const newEntry = {
        fy,
        quarter,
        rate,
        by: 'Ashish Ranjan',
        on: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'Pending Approval'
      };
      setEntries(prev => [newEntry, ...prev.filter(e => !(e.fy === fy && e.quarter === quarter))]);
      setIsEditingWithdrawn(false);
    }, 800);
  };

  const resetForm = () => {
    setShowSuccess(false);
    setDistMasterSubmitted(false);
    setRate('0.1250');
    setFy('FY 2025-26');
    setQuarter('Q3');
    setIsEditingWithdrawn(false);
    setStep(1);
    setFileSelected(null);
    setValidationState('idle');
    setDuplicateConfirmed(false);
  };

  const handleWithdraw = () => {
    setShowWithdrawConfirm(true);
  };

  const confirmWithdraw = () => {
    setEntries(prev => prev.map(e => 
      (e.fy === selectedEntry.fy && e.quarter === selectedEntry.quarter) 
        ? { ...e, status: 'Draft' } 
        : e
    ));
    setShowWithdrawConfirm(false);
    setShowViewModal(false);
    setShowWithdrawToast(true);
    setTimeout(() => setShowWithdrawToast(false), 3000);
  };

  const handleEditDraft = (entry: any) => {
    setFy(entry.fy);
    setQuarter(entry.quarter);
    setRate(entry.rate);
    setIsEditingWithdrawn(true);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openViewModal = (entry: any) => {
    setSelectedEntry(entry);
    setShowViewModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Rejection Banner */}
      {distMasterRejection && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-red-900">Submission Rejected</h3>
                <Badge variant="error" className="text-red-600 border-red-200 bg-red-50">
                  Rejected on {distMasterRejection.rejectedAt}
                </Badge>
              </div>
              <p className="text-red-800 font-semibold mb-1">Reason: {distMasterRejection.reason}</p>
              <p className="text-red-700 text-sm mb-4 italic">"{distMasterRejection.comment}"</p>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => {
                    clearRejection(`distribution-master-${quarter}-${fy.replace(' ', '')}`);
                    setDistMasterSubmitted(false);
                    setShowEditBanner(true);
                    setRateEditable(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6"
                >
                  Edit & Resubmit
                </Button>
                <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-100 font-bold">
                  View Rejection Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditingWithdrawn && (
        <div className="bg-[#FFFBEB] border border-[#F59E0B] rounded-xl p-4 mb-6 flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FEF3C7] rounded-full flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-[#D97706]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#92400E]">Editing Withdrawn Distribution Master</p>
              <p className="text-xs text-[#B45309]">{quarter} {fy} — You can update the rate and resubmit.</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsEditingWithdrawn(false);
              setStep(1);
              setRate('0.1250');
            }}
            className="text-[#B45309] hover:text-[#92400E] p-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-[#8B1A1A]">Distribution Master</h2>
        <p className="text-[#1A1A1A] mt-1">Configure and manage quarterly distribution rates</p>
      </div>

      {isDistMasterApproved && (
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #86EFAC',
          borderRadius: '14px',
          padding: '20px 24px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <CheckCircle2 size={28} color="#166534" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontWeight: 'bold', color: '#166534', fontSize: '16px', margin: 0 }}>Distribution Master — Approved & Locked</h3>
              <p style={{ color: '#166534', fontSize: '13px', marginTop: '2px', opacity: 0.85, margin: 0 }}>
                Q3 FY 2025-26 — Unit rate ₹0.1250 is locked. Distribution processing is now unblocked.
              </p>
              {distMasterNotif && (
                <p style={{ color: '#166534', fontSize: '12px', marginTop: '4px', opacity: 0.7, margin: 0 }}>
                  Approved by {distMasterNotif.approvedBy} on {distMasterNotif.approvedAt}
                </p>
              )}
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#166534',
            color: 'white',
            borderRadius: '20px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: '700'
          }}>
            🔒 Rate Locked
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wizard Section */}
        <div className="lg:col-span-1">
          {distMasterSubmitted && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ fontWeight: 'bold', color: '#166534', margin: 0 }}>
                ✅ Distribution Master submitted for approval
              </p>
              <p style={{ color: '#166534', fontSize: '13px', marginTop: '4px', margin: 0 }}>
                Awaiting review by approver. You can track status in the Approval Queue.
              </p>
            </div>
          )}

          {!showSuccess ? (
            <Card title="Distribution Master Wizard" subtitle="Follow the steps to upload distribution data">
              <div className="space-y-6 mt-6">
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex flex-col items-center flex-1 relative">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10",
                        step === s ? "bg-[#8B1A1A] text-white" : step > s ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400 border border-gray-200"
                      )}>
                        {step > s ? "✓" : s}
                      </div>
                      <span className={cn(
                        "text-[10px] mt-2 font-bold uppercase tracking-wider",
                        step >= s ? "text-[#8B1A1A]" : "text-gray-400"
                      )}>
                        {s === 1 ? "Quarter" : s === 2 ? "Upload" : "Review"}
                      </span>
                      {s < 3 && (
                        <div className={cn(
                          "absolute top-4 left-[60%] w-[80%] h-[2px]",
                          step > s ? "bg-emerald-600" : "bg-gray-100"
                        )} />
                      )}
                    </div>
                  ))}
                </div>

                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Financial Year</label>
                      <select 
                        value={fy}
                        onChange={(e) => setFy(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20"
                      >
                        <option>FY 2025-26</option>
                        <option>FY 2024-25</option>
                        <option>FY 2023-24</option>
                        <option>FY 2022-23</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quarter</label>
                      <select 
                        value={quarter}
                        onChange={(e) => setQuarter(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20"
                      >
                        <option>Q1</option>
                        <option>Q2</option>
                        <option>Q3</option>
                        <option>Q4</option>
                      </select>
                    </div>

                    {distMasterPending && (
                      <div style={{
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #F59E0B',
                        borderRadius: '10px',
                        padding: '14px 16px',
                        marginTop: '12px'
                      }}>
                        <p style={{ fontWeight: '600', 
                          color: '#92400E', fontSize: '13px',
                          marginBottom: '4px' }}>
                          ⏳ Submission Already Pending
                        </p>
                        <p style={{ color: '#92400E', fontSize: '12px',
                          lineHeight: '1.5' }}>
                          A Distribution Master upload for {quarter} {fy} is 
                          already awaiting approval. You cannot 
                          start a new upload for the same quarter 
                          until the current submission is reviewed.
                        </p>
                        <div style={{ 
                          display: 'flex', gap: '8px', marginTop: '12px' 
                        }}>
                          <button 
                            onClick={() => navigate('/admin/approvals')}
                            style={{
                              border: '1px solid #D97706', color: '#D97706',
                              backgroundColor: 'white', borderRadius: '8px',
                              padding: '6px 12px', fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            View in Approval Queue →
                          </button>
                          
                          <button 
                            onClick={() => setStep(3)}
                            style={{
                              border: '1px solid #D1D5DB', color: '#6B7280',
                              backgroundColor: 'white', borderRadius: '8px',
                              padding: '6px 12px', fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            View Submitted Summary
                          </button>
                        </div>
                      </div>
                    )}

                    {quarterStatus === 'approved' ? (
                      <div style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '12px',
                        padding: '20px',
                        marginTop: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                          <Lock size={20} color='#DC2626' style={{ flexShrink: 0 }} />
                          <span style={{ fontWeight: 'bold', color: '#DC2626', fontSize: '14px' }}>
                            Upload Blocked — Quarter Already Approved
                          </span>
                        </div>
                        
                        <p style={{ color: '#DC2626', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
                          Distribution Master for <strong>{quarter} {fy}</strong> has already been approved. Re-uploading is not permitted for an approved quarter.
                        </p>
                        
                        {isLocked && (
                          <p style={{ color: '#DC2626', fontSize: '12px', lineHeight: '1.5', marginBottom: '16px', opacity: 0.85 }}>
                            Additionally, Distribution Processing for this quarter has been finalized and locked — making this record permanently immutable.
                          </p>
                        )}
                        
                        <div style={{ backgroundColor: 'white', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                          <p style={{ fontSize: '12px', color: '#374151' }}>
                            If you believe this is an error, please contact the system administrator or raise a change request through proper channels.
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setHighlightedQuarter(`${quarter}-${fy}`);
                            document.getElementById('existing-entries')?.scrollIntoView({ behavior: 'smooth' });
                            setTimeout(() => setHighlightedQuarter(null), 3000);
                          }}
                          style={{
                            border: '1px solid #8B1A1A',
                            color: '#8B1A1A',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          View Approved Entry →
                        </button>
                      </div>
                    ) : quarterStatus === 'historical' ? (
                      <div style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FCA5A5',
                        borderRadius: '12px',
                        padding: '20px',
                        marginTop: '16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                          <Lock size={20} color='#DC2626' style={{ flexShrink: 0 }} />
                          <span style={{ fontWeight: 'bold', color: '#DC2626', fontSize: '14px' }}>
                            Upload Blocked — Processing Finalized
                          </span>
                        </div>
                        
                        <p style={{ color: '#DC2626', fontSize: '13px', lineHeight: '1.5', marginBottom: '12px' }}>
                          Distribution Processing for <strong>{quarter} {fy}</strong> has been approved and permanently locked. Distribution Master for this quarter cannot be modified as it would affect finalized distribution calculations.
                        </p>
                        
                        <div style={{ backgroundColor: 'white', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
                          <p style={{ fontSize: '12px', color: '#374151' }}>
                            If you believe this is an error, please contact the system administrator or raise a change request through proper channels.
                          </p>
                        </div>
                        
                        <button 
                          onClick={() => {
                            setHighlightedQuarter(`${quarter}-${fy}`);
                            document.getElementById('existing-entries')?.scrollIntoView({ behavior: 'smooth' });
                            setTimeout(() => setHighlightedQuarter(null), 3000);
                          }}
                          style={{
                            border: '1px solid #8B1A1A',
                            color: '#8B1A1A',
                            backgroundColor: 'white',
                            borderRadius: '10px',
                            padding: '8px 16px',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          View Approved Entry →
                        </button>
                      </div>
                    ) : (
                      <>
                        {isLocked ? (
                          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <Lock className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-bold text-red-900">Processing Finalized</p>
                              <p className="text-xs text-red-800 mt-1">
                                🔒 Distribution Processing for {quarter} {fy} has been approved and permanently locked. The Distribution Master for this quarter cannot be modified.
                              </p>
                            </div>
                          </div>
                        ) : isDuplicate ? (
                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-sm font-bold text-amber-900">Duplicate Quarter</p>
                                <p className="text-xs text-amber-800 mt-1">
                                  ⚠ Distribution Master for {quarter} {fy} already exists and is approved. Re-uploading will overwrite the locked rate for this quarter.
                                </p>
                              </div>
                            </div>
                            <label className="flex items-center gap-2 mt-4 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={duplicateConfirmed}
                                onChange={(e) => setDuplicateConfirmed(e.target.checked)}
                                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                              />
                              <span className="text-xs font-medium text-amber-900">I confirm I want to overwrite this quarter</span>
                            </label>
                          </div>
                        ) : (
                          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-800">
                              Select the quarter for which you want to upload the distribution master file.
                            </p>
                          </div>
                        )}

                        <Button 
                          onClick={() => setStep(2)}
                          disabled={isLocked || (isDuplicate && !duplicateConfirmed) || distMasterPending}
                          className="w-full bg-[#8B1A1A] hover:bg-[#6B1010] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                        >
                          Continue to Upload <ArrowRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setStep(1)} className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-[#8B1A1A]">
                        <ArrowLeft className="h-3 w-3" /> Back to Step 1
                      </button>
                      <Badge variant="neutral" className="bg-[#FDF0F0] text-[#8B1A1A] border-[#D4A0A0]">
                        {quarter} {fy}
                      </Badge>
                    </div>

                    {showPreProcess ? (
                      <div className="py-8 text-center space-y-4">
                        <Loader2 className="h-10 w-10 text-[#8B1A1A] animate-spin mx-auto" />
                        <div>
                          <p className="font-bold text-[#1A1A1A]">
                            {preProcessStep === 0 ? "Reading file structure..." : "Validating data integrity..."}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">Please wait while we process the file</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div 
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          className={cn(
                            "border-2 border-dashed rounded-2xl p-8 text-center transition-all",
                            isDragging ? "border-[#8B1A1A] bg-[#FDF0F0]" : "border-slate-200 hover:border-slate-300"
                          )}
                        >
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Upload className="h-6 w-6 text-slate-400" />
                          </div>
                          <h3 className="text-sm font-bold text-[#1A1A1A]">Click or drag file to upload</h3>
                          <p className="text-[10px] text-slate-500 mt-1">Expected: DistMaster_{fy.replace(' ', '')}_{quarter}.xlsx</p>
                          
                          <input 
                            key={uploadKey}
                            type="file" 
                            className="hidden" 
                            id="dist-file-upload" 
                            onChange={handleFileChange} 
                            accept=".csv,.xlsx" 
                          />
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="mt-6 border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#FDF0F0]" 
                            onClick={() => document.getElementById('dist-file-upload')?.click()}
                          >
                            Select File
                          </Button>
                        </div>

                        {fileSelected && (
                          <div className="bg-[#FDF0F0] border border-[#D4A0A0] rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-[#D4A0A0]">
                                <FileSpreadsheet className="h-6 w-6 text-[#8B1A1A]" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-[#1A1A1A] truncate max-w-[150px]">{fileSelected.name}</p>
                                <p className="text-[10px] text-slate-500">{fileSelected.size}</p>
                              </div>
                            </div>
                            <button onClick={() => setFileSelected(null)} className="text-slate-400 hover:text-red-500">
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <div className="flex items-center gap-2 text-[#8B1A1A] font-bold text-xs mb-2">
                            <Info className="h-3 w-3" /> Sample Template
                          </div>
                          <p className="text-[10px] text-slate-600 mb-3">Download the template to ensure correct file format and headers.</p>
                          <button className="text-[10px] font-bold text-[#8B1A1A] flex items-center gap-1 hover:underline">
                            <FileText className="h-3 w-3" /> Download DistMaster_Template.xlsx
                          </button>
                        </div>

                        <Button 
                          onClick={handleUpload}
                          disabled={!fileSelected}
                          className="w-full bg-[#8B1A1A] hover:bg-[#6B1010] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                        >
                          Process & Validate <ArrowRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between">
                      {!isEditingWithdrawn ? (
                        <button onClick={() => setStep(2)} className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:text-[#8B1A1A]">
                          <ArrowLeft className="h-3 w-3" /> Back to Step 2
                        </button>
                      ) : (
                        <div />
                      )}
                      <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {isEditingWithdrawn ? "Draft Mode" : "Validated ✓"}
                      </Badge>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <div className="bg-[#8B1A1A] px-4 py-2 text-white text-[10px] font-bold uppercase tracking-widest">
                        Extracted Parameters
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                          <span className="text-xs text-slate-500">Financial Year</span>
                          <span className="text-xs font-bold text-[#1A1A1A]">{fy}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                          <span className="text-xs text-slate-500">Quarter</span>
                          <span className="text-xs font-bold text-[#1A1A1A]">{quarter}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-500">Unit Rate</span>
                          {isEditingWithdrawn ? (
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#8B1A1A]">₹</span>
                              <input 
                                type="text"
                                value={rate}
                                onChange={handleRateChange}
                                className="w-20 bg-white border border-[#D4A0A0] rounded px-2 py-1 text-xs font-bold text-[#8B1A1A] focus:outline-none focus:ring-1 focus:ring-[#8B1A1A]"
                              />
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-[#8B1A1A]">₹{rate}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs mb-1">
                        <CheckCircle className="h-3 w-3" /> Validation Successful
                      </div>
                      <p className="text-[10px] text-emerald-600">
                        File structure and rate format are correct. Ready for submission.
                      </p>
                    </div>

                    {distMasterPending ? (
                      <div style={{
                        backgroundColor: '#FFFBEB',
                        border: '1px solid #F59E0B',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px'
                      }}>
                        <Clock size={20} color='#D97706' style={{ flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontWeight: 'bold', color: '#92400E', fontSize: '14px', margin: 0 }}>
                            Submission Pending Approval
                          </p>
                          <p style={{ color: '#92400E', fontSize: '13px', marginTop: '4px', margin: 0 }}>
                            This Distribution Master upload for {quarter} {fy} is 
                            currently in the Approval Queue awaiting 
                            review. You cannot submit again until the 
                            approver takes action.
                          </p>
                        </div>
                        <button 
                          onClick={() => navigate('/admin/approvals')}
                          style={{
                            border: '1px solid #D97706', color: '#D97706',
                            backgroundColor: 'white', borderRadius: '8px', 
                            padding: '8px 14px', fontSize: '13px',
                            cursor: 'pointer', flexShrink: 0
                          }}
                        >
                          View in Queue →
                        </button>
                      </div>
                    ) : (
                      <Button 
                        onClick={handleSubmitClick}
                        disabled={isLoading}
                        className="w-full bg-[#8B1A1A] hover:bg-[#6B1010] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
                          </>
                        ) : (
                          <>Submit for Approval <Send className="h-4 w-4" /></>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ) : (
            <Card className="text-center py-10 px-6">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[#FDF0F0] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-10 w-10 text-[#8B1A1A]" />
                </div>
                <h3 className="text-2xl font-bold text-[#8B1A1A] mb-2">Submitted Successfully!</h3>
                <p className="text-[#1A1A1A] text-sm mb-6 max-w-xs mx-auto">
                  Your distribution master entry for {quarter} {fy} has been submitted to the Approver.
                </p>
                <div className="bg-[#fef3c7] text-[#92400e] rounded-full px-4 py-2 font-semibold text-sm mb-8 border border-[#F59E0B]">
                  Pending Approval
                </div>
                
                <div className="w-full bg-[#FDF0F0] rounded-xl p-5 text-left mb-8 border border-[#D4A0A0]">
                  <h4 className="text-[#8B1A1A] font-bold text-sm mb-3">What happens next?</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                      <span className="text-[#8B1A1A]">✓</span> Approver (Checker) will review the entry
                    </li>
                    <li className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                      <span className="text-[#8B1A1A]">✓</span> You will be notified once approved or rejected
                    </li>
                    <li className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                      <span className="text-[#8B1A1A]">✓</span> Once approved, rate will be locked for {quarter} {fy}
                    </li>
                    <li className="flex items-start gap-2 text-xs text-[#1A1A1A]">
                      <span className="text-[#8B1A1A]">✓</span> Distribution Processing can begin after approval
                    </li>
                  </ul>
                </div>

                <button 
                  onClick={() => navigate('/admin/approvals')}
                  className="w-full py-3 bg-[#8B1A1A] text-white rounded-xl font-bold hover:bg-[#6B1010] transition-all flex items-center justify-center gap-2 mb-4"
                >
                  Go to Approval Queue <ArrowRight className="h-4 w-4" />
                </button>
                
                <button 
                  onClick={resetForm}
                  className="text-[#8B1A1A] font-bold text-sm flex items-center gap-1 hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> Create Another Entry
                </button>
              </div>
            </Card>
          )}
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2" id="existing-entries">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-[#8B1A1A]">Existing Entries</h3>
              <div className="flex items-center gap-2">
                <Badge variant="neutral" className="text-[10px] bg-[#FDF0F0] text-[#8B1A1A] border-[#D4A0A0]">FY 2025-26</Badge>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#8B1A1A] text-white">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-left">FY</th>
                    <th className="px-6 py-4 font-semibold text-center">Quarter</th>
                    <th className="px-6 py-4 font-semibold text-center">Unit Rate</th>
                    <th className="px-6 py-4 font-semibold text-center">Created By</th>
                    <th className="px-6 py-4 font-semibold text-center">Created On</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                    <th className="px-6 py-4 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                 <tbody>
                  {entries.map((row, i) => {
                    const isHighlighted = highlightedQuarter === `${row.quarter}-${row.fy}`;
                    return (
                      <tr 
                        key={i} 
                        className={cn(
                          isHighlighted ? "bg-[#FDF0F0]" : (i % 2 !== 0 ? "bg-[#FDF0F0]" : "bg-white"),
                          "transition-all duration-500"
                        )}
                        style={{
                          border: isHighlighted ? '2px solid #8B1A1A' : 'none'
                        }}
                      >
                        <td className="px-6 py-4 font-medium text-slate-600 text-left">{row.fy}</td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-center">{row.quarter}</td>
                        <td className="px-6 py-4 font-bold text-[#8B1A1A] text-center">{row.rate}</td>
                        <td className="px-6 py-4 text-slate-600 text-center">{row.by}</td>
                        <td className="px-6 py-4 text-slate-600 text-center">{row.on}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold",
                              row.status === 'Approved' ? "bg-emerald-100 text-emerald-700" : 
                              row.status === 'Pending Approval' ? "bg-amber-100 text-amber-700" :
                              "bg-gray-100 text-gray-600"
                            )}>
                              {row.status}
                            </span>
                            {isHighlighted && (
                              <span style={{
                                backgroundColor: '#8B1A1A',
                                color: 'white',
                                borderRadius: '20px',
                                padding: '2px 10px',
                                fontSize: '11px',
                                fontWeight: '600',
                                marginLeft: '8px'
                              }}>
                                ← This entry
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {row.status === 'Draft' ? (
                            <button 
                              onClick={() => handleEditDraft(row)}
                              className="text-[#8B1A1A] font-bold hover:underline flex items-center justify-center gap-1"
                            >
                              Edit
                            </button>
                          ) : (
                            <button 
                              onClick={() => openViewModal(row)}
                              className="text-[#8B1A1A] font-bold hover:underline flex items-center justify-center gap-1"
                            >
                              <Eye className="h-3 w-3" /> View
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto pt-32 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FDF0F0] rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-[#8B1A1A]" />
              </div>
              <h3 className="text-xl font-bold text-[#8B1A1A] mb-2">Submit for Approval?</h3>
              <p className="text-[#1A1A1A] text-sm">The following entry will be sent to the Approver for review:</p>
              
              <div className="w-full bg-[#FDF0F0] rounded-lg p-4 mt-4 text-left space-y-2 border border-[#D4A0A0]">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Financial Year:</span>
                  <span className="font-bold text-[#8B1A1A]">{fy}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Quarter:</span>
                  <span className="font-bold text-[#8B1A1A]">{quarter}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Unit Distribution Rate:</span>
                  <span className="font-bold text-[#8B1A1A]">{rate} per unit</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Submitted By:</span>
                  <span className="font-bold text-[#8B1A1A]">Ashish Ranjan (Creator)</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Submitted On:</span>
                  <span className="font-bold text-[#8B1A1A]">{new Date().toLocaleString()}</span>
                </div>
              </div>
              
              <p className="text-[10px] text-amber-600 mt-3 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Once approved, this rate cannot be modified.
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <button 
                  onClick={() => !isLoading && setShowModal(false)}
                  disabled={isLoading}
                  className="border border-gray-300 text-gray-600 rounded-lg px-6 py-3 font-bold hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmSubmit}
                  disabled={isLoading}
                  className="bg-[#8B1A1A] text-white rounded-lg px-6 py-3 font-bold hover:bg-[#6B1010] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>Yes, Submit</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* View Modal */}
      {showViewModal && selectedEntry && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-8 animate-in zoom-in-95 duration-200">
            {showWithdrawConfirm ? (
              <div className="flex flex-col items-center text-center py-4 animate-in fade-in slide-in-from-bottom-4">
                <AlertTriangle className="h-16 w-16 text-[#DC2626] mb-4" />
                <h3 className="text-xl font-bold text-[#DC2626]">Withdraw Submission?</h3>
                <p className="text-gray-600 text-sm mt-2">
                  Are you sure you want to withdraw the {selectedEntry.quarter} {selectedEntry.fy} Distribution Master submission?
                </p>
                <div className="bg-[#FEF2F2] border border-red-200 rounded-lg p-4 mt-4 text-sm text-left w-full">
                  <p className="text-red-700 font-bold mb-2">This action will:</p>
                  <ul className="space-y-1 text-red-700 list-disc list-inside">
                    <li>Return the entry to Draft status</li>
                    <li>Remove it from the Approver's queue</li>
                    <li>Allow you to edit and resubmit</li>
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full mt-8">
                  <button 
                    onClick={() => setShowWithdrawConfirm(false)}
                    className="border border-gray-300 text-gray-600 rounded-lg px-5 py-2.5 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel — Keep Submitted
                  </button>
                  <button 
                    onClick={confirmWithdraw}
                    className="bg-[#DC2626] text-white rounded-lg px-5 py-2.5 font-bold hover:bg-[#B91C1C] transition-colors"
                  >
                    Yes, Withdraw
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-[#8B1A1A]">Distribution Master — {selectedEntry.quarter} {selectedEntry.fy}</h3>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold",
                      selectedEntry.status === 'Approved' ? "bg-emerald-100 text-emerald-700" : 
                      selectedEntry.status === 'Pending Approval' ? "bg-amber-100 text-amber-700" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {selectedEntry.status}
                    </span>
                  </div>
                  <button onClick={() => setShowViewModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Section 1 — Entry Details */}
                  <div className="bg-[#FDF0F0] rounded-xl p-5 space-y-3 border border-[#D4A0A0]">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Financial Year</p>
                        <p className="font-bold text-[#8B1A1A]">{selectedEntry.fy}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Quarter</p>
                        <p className="font-bold text-[#8B1A1A]">{selectedEntry.quarter}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Unit Distribution Rate</p>
                        <p className="font-bold text-[#8B1A1A]">{selectedEntry.rate} per unit</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Created By</p>
                        <p className="font-bold text-[#8B1A1A]">{selectedEntry.by} (Creator)</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Created On</p>
                        <p className="font-bold text-[#8B1A1A]">{selectedEntry.on}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Current Status</p>
                        <p className="font-bold text-[#8B1A1A]">{selectedEntry.status}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2 — Approval Timeline */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#8B1A1A] mb-4">Approval Timeline</h4>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-4 h-4 rounded-full bg-[#8B1A1A] flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                          <div className="w-0.5 h-10 bg-[#8B1A1A]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">Submitted</p>
                          <p className="text-xs text-slate-500">{selectedEntry.by} — {selectedEntry.on}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn(
                            "w-4 h-4 rounded-full flex items-center justify-center",
                            selectedEntry.status === 'Approved' ? "bg-[#8B1A1A]" : "border-2 border-[#8B1A1A] bg-white"
                          )}>
                            {selectedEntry.status === 'Approved' && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A1A1A]">
                            {selectedEntry.status === 'Approved' ? 'Approved' : 'Pending Approver Review'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {selectedEntry.status === 'Approved' 
                              ? `${selectedEntry.approvedBy} — ${selectedEntry.approvedOn}` 
                              : 'Awaiting action'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3 — Impact Preview */}
                  <div>
                    <h4 className="text-sm font-semibold text-[#8B1A1A] mb-3">Processing Impact</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Active Investors:</span>
                        <span className="font-bold text-[#8B1A1A]">1,102</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Estimated Gross:</span>
                        <span className="font-bold text-[#8B1A1A]">₹1,37,750.00</span>
                      </div>
                      <p className="text-[10px] text-gray-400 italic">Note: Final amounts calculated during processing.</p>
                    </div>
                  </div>

                  {selectedEntry.status === 'Approved' && (
                    <div className="bg-[#FDF0F0] rounded-lg p-3 text-sm text-[#8B1A1A] flex items-center gap-2 border border-[#D4A0A0]">
                      <Lock className="h-4 w-4" />
                      <span>🔒 This entry is approved and permanently locked.</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => setShowViewModal(false)}
                      className="border border-gray-300 text-gray-600 rounded-lg px-6 py-2 font-bold hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                    {selectedEntry.status === 'Pending Approval' && (
                      <button 
                        onClick={handleWithdraw}
                        className="border border-red-300 text-red-500 rounded-lg px-4 py-2 font-bold hover:bg-red-50 transition-colors"
                      >
                        Withdraw Submission
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Withdraw Toast */}
      {showWithdrawToast && (
        <div className="fixed top-4 right-4 bg-white border-l-4 border-[#DC2626] shadow-lg rounded-lg p-4 z-50 animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col">
            <p className="font-semibold text-[#1A1A1A]">↩ Submission Withdrawn</p>
            <p className="text-gray-500 text-sm">Q3 FY 2025-26 entry returned to Draft. You can now edit and resubmit.</p>
          </div>
        </div>
      )}
    </div>
  );
};
