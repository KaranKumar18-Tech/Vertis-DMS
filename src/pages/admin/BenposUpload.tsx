import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  History, 
  FileText,
  XCircle,
  Clock,
  Info,
  ChevronRight,
  X,
  Loader2,
  CheckCircle,
  ArrowRight,
  Lock,
  Search,
  Filter,
  Download,
  Play,
  Zap,
  Send,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { useApprovals } from '../../context/ApprovalContext';

export const BenposUpload = () => {
  const { submitForApproval, rejectedItems, clearRejection, approvedItems, notifications, isItemPending, isItemApproved, isItemRejected } = useApprovals();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'uploaded' | 'submitted'>('idle');
  const [showSummary, setShowSummary] = useState(false);
  const [uploadTime, setUploadTime] = useState('');
  const [uploadKey, setUploadKey] = useState(0);
  const [step, setStep] = useState(1);
  const [benposSubmitted, setBenposSubmitted] = useState(false);
  const [showReupload, setShowReupload] = useState(false);
  const [showRejectionDetailModal, setShowRejectionDetailModal] = useState(false);
  
  const [selectedFY, setSelectedFY] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [periodConfirmed, setPeriodConfirmed] = useState(false);
  const [periodError, setPeriodError] = useState(false);
  const [submitError, setSubmitError] = useState<'locked' | 'approved' | 'pending' | null>(null);

  const isApproved = isItemApproved('benpos', selectedQuarter, selectedFY);
  const isRejected = isItemRejected('benpos', selectedQuarter, selectedFY);
  const benposPending = isItemPending('benpos', selectedQuarter, selectedFY);

  const quarterStatus = !selectedFY || !selectedQuarter ? null :
                        isApproved ? 'approved' :
                        benposPending ? 'pending' :
                        isRejected ? 'rejected' : 'open';

  const handleConfirmPeriod = () => {
    // Validation — both must be selected
    if (!selectedFY || !selectedQuarter) {
      setPeriodError(true);
      return;
    }
    
    setPeriodError(false);
    setPeriodConfirmed(true);
    setStep(2); // always proceed to file upload
  };
  
  const benposItemId = selectedQuarter && selectedFY
    ? `benpos-${selectedQuarter}-${selectedFY.replace(' ', '')}`
    : '';
  const benposRejection = benposItemId ? rejectedItems[benposItemId] : null;

  const isBenposApproved = benposItemId ? approvedItems.includes(benposItemId) : false;
  const benposApprovalNotif = notifications.find(
    n => n.itemId === benposItemId && n.type === 'approval'
  );
  const [fileSelected, setFileSelected] = useState<{name: string, size: string} | null>(null);
  const [fileProcessed, setFileProcessed] = useState(false);
  const [showPreProcess, setShowPreProcess] = useState(false);
  const [preProcessStep, setPreProcessStep] = useState(0);
  const [validationState, setValidationState] = useState<'idle' | 'validating' | 'complete'>('idle');
  const [validationSteps, setValidationSteps] = useState<string[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryRow, setSelectedHistoryRow] = useState<any>(null);

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
      // Automatically clear previous summary and validation
      setValidationState('idle');
      setShowSummary(false);
      setUploadState('idle');
      setStep(1);
      
      setFileSelected({
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      });
    }
  };

  const handleReset = () => {
    setFileSelected(null);
    setFileProcessed(false);
    setValidationState('idle');
    setShowSummary(false);
    setUploadState('idle');
    setStep(1);
    setUploadKey(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpload = () => {
    if (!fileSelected) return;
    
    setStep(2);
    setShowPreProcess(true);
    setPreProcessStep(0);
    
    // Step 1 completes after 800ms
    setTimeout(() => setPreProcessStep(1), 800);
    
    // Step 2 completes after 1600ms  
    setTimeout(() => setPreProcessStep(2), 1600);
    
    // Step 3 completes after 2400ms
    setTimeout(() => setPreProcessStep(3), 2400);
    
    // Then show Step 3 results after 3200ms
    setTimeout(() => {
      setShowPreProcess(false);
      setValidationState('complete');
      setUploadState('uploaded');
      setShowSummary(true);
      setStep(3);
      setFileProcessed(true);
      setUploadTime(new Date().toLocaleString());
    }, 3200);
  };

  const handleSubmitForApproval = () => {
    setSubmitError(null);
    
    // Only check: already pending?
    if (isItemPending('benpos', selectedQuarter, selectedFY)) {
      setSubmitError('pending');
      return;
    }
    
    // Only check: already approved?
    if (isItemApproved('benpos', selectedQuarter, selectedFY)) {
      setSubmitError('approved');
      return;
    }
    
    if (benposRejection) {
      clearRejection(benposItemId);
    }

    // ✅ Submit — no other blocks
    submitForApproval({
      id: benposItemId,
      type_key: 'benpos',
      quarter: selectedQuarter,
      fy: selectedFY,
      type: 'BENPOS Upload',
      title: `BENPOS Master — ${selectedQuarter} ${selectedFY}`,
      stats: [
        { label: 'NEW RECORDS', value: '48', color: '#8B1A1A' },
        { label: 'MODIFIED', value: '1,054', color: '#1A1A1A' },
        { label: 'REJECTED', value: '3', color: '#DC2626' }
      ],
      timer: 'Just submitted',
      gridCols: 3
    });
    
    setBenposSubmitted(true);
    setShowReupload(false);
    setUploadState('submitted');
  };

  const rejectedRecords = [
    { id: 'DPCL00234', reason: 'Missing TDS% field' },
    { id: 'DPCL00891', reason: 'Duplicate DPCLIENTID in file' },
    { id: 'DPCL01102', reason: 'Invalid PAN format' },
  ];

  const historyData = [
    { 
      date: '15 Jan 2026', 
      quarter: 'Q3 FY 2025-26', 
      new: 48, 
      modified: 1054, 
      rejected: 3, 
      by: 'Ashish Ranjan', 
      status: 'Pending Approval',
      rejectedDetails: [
        { id: 'DPCL00234', reason: 'Missing TDS% field' },
        { id: 'DPCL00891', reason: 'Duplicate DPCLIENTID in file' },
        { id: 'DPCL01102', reason: 'Invalid PAN format' }
      ]
    },
    { 
      date: '01 Oct 2025', 
      quarter: 'Q2 FY 2025-26', 
      new: 12, 
      modified: 1089, 
      rejected: 0, 
      by: 'Rahul Sharma', 
      status: 'Approved',
      approvedBy: 'Rahul Sharma',
      approvedOn: '02 Oct 2025, 09:15 AM'
    },
    { 
      date: '02 Jul 2025', 
      quarter: 'Q1 FY 2025-26', 
      new: 34, 
      modified: 1021, 
      rejected: 2, 
      by: 'Ashish Ranjan', 
      status: 'Approved',
      approvedBy: 'Rahul Sharma',
      approvedOn: '03 Jul 2025, 11:00 AM',
      rejectedDetails: [
        { id: 'DPCL00445', reason: 'Invalid email format' },
        { id: 'DPCL00778', reason: 'Missing mobile number' }
      ]
    },
    { 
      date: '03 Apr 2025', 
      quarter: 'Q4 FY 2024-25', 
      new: 8, 
      modified: 1095, 
      rejected: 1, 
      by: 'Rahul Sharma', 
      status: 'Approved',
      approvedBy: 'Rahul Sharma',
      approvedOn: '04 Apr 2025, 02:30 PM',
      rejectedDetails: [
        { id: 'DPCL00312', reason: 'Duplicate DPCLIENTID in file' }
      ]
    },
    { 
      date: '05 Jan 2025', 
      quarter: 'Q3 FY 2024-25', 
      new: 21, 
      modified: 1043, 
      rejected: 0, 
      by: 'Ashish Ranjan', 
      status: 'Rejected',
      rejectedBy: 'Rahul Sharma',
      rejectionReason: 'BENPOS data inconsistency found in unit holdings. Please re-upload with corrected data.',
      rejectedOn: '06 Jan 2025, 10:00 AM'
    },
  ];

  const openHistoryModal = (row: any) => {
    setSelectedHistoryRow(row);
    setShowHistoryModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#8B1A1A]">BENPOS Master</h2>
        <p className="text-[#1A1A1A] mt-1">Manage and upload shareholder beneficiary position data</p>
      </div>

      {isBenposApproved && (
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
            <CheckCircle size={28} color="#166534" style={{ flexShrink: 0 }} />
            <div>
              <h3 style={{ fontWeight: 'bold', color: '#166534', fontSize: '16px', margin: 0 }}>BENPOS Master — Approved & Active</h3>
              <p style={{ color: '#166534', fontSize: '13px', marginTop: '2px', opacity: 0.85, margin: 0 }}>
                {selectedQuarter} {selectedFY} — Investor records are now active for distribution processing.
              </p>
              {benposApprovalNotif && (
                <p style={{ color: '#166534', fontSize: '12px', marginTop: '4px', opacity: 0.7, margin: 0 }}>
                  Approved by {benposApprovalNotif.approvedBy} on {benposApprovalNotif.approvedAt}
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
            ✅ Active
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('upload')}
          className={cn(
            "px-6 py-3 text-sm transition-all",
            activeTab === 'upload' 
              ? "border-b-2 border-[#8B1A1A] text-[#8B1A1A] font-semibold" 
              : "text-gray-500 hover:text-[#8B1A1A]"
          )}
        >
          Upload New BENPOS
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={cn(
            "px-6 py-3 text-sm transition-all",
            activeTab === 'history' 
              ? "border-b-2 border-[#8B1A1A] text-[#8B1A1A] font-semibold" 
              : "text-gray-500 hover:text-[#8B1A1A]"
          )}
        >
          Upload History
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div className="space-y-6">
          {/* Rejection Banner */}
          {benposRejection && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-6 animate-in fade-in slide-in-from-top-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-red-900">Submission Rejected</h3>
                    <Badge variant="error" className="text-red-600 border-red-200 bg-red-50">
                      Rejected on {benposRejection.rejectedAt}
                    </Badge>
                  </div>
                  <p className="text-red-800 font-semibold mb-1">Reason: {benposRejection.reason}</p>
                  <p className="text-red-700 text-sm mb-4 italic">"{benposRejection.comment}"</p>
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => {
                        clearRejection(benposItemId);
                        setBenposSubmitted(false);
                        setShowReupload(true);
                        handleReset();
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-6"
                    >
                      Upload Revised File
                    </Button>
                    <Button 
                      onClick={() => setShowRejectionDetailModal(true)}
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-100 font-bold"
                    >
                      View Rejection Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Revised Upload Info Banner */}
          {showReupload && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-left-4">
              <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900 font-bold">Revised Upload Mode</p>
                <p className="text-xs text-amber-800">Please upload the corrected BENPOS file addressing the rejection comments above.</p>
              </div>
            </div>
          )}

          {/* Success Banner */}
          {benposSubmitted && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <p style={{ fontWeight: 'bold', color: '#166534', margin: 0 }}>
                ✅ BENPOS Upload submitted for approval
              </p>
              <p style={{ color: '#166534', fontSize: '13px', marginTop: '4px', margin: 0 }}>
                Awaiting review by approver. You can track status in the Approval Queue.
              </p>
            </div>
          )}

          {benposPending && (
            <div style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #F59E0B',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '16px'
            }}>
              <p style={{ fontWeight: '600', 
                color: '#92400E', fontSize: '13px',
                marginBottom: '4px' }}>
                ⏳ Submission Already Pending
              </p>
              <p style={{ color: '#92400E', fontSize: '12px',
                lineHeight: '1.5' }}>
                A BENPOS upload for {selectedQuarter} {selectedFY} is 
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

          {/* STEP INDICATOR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', marginTop: '8px' }}>
            {[
              { n: 1, label: quarterStatus === 'rejected' ? 'Upload Revised File' : 'Select File' },
              { n: 2, label: 'Process & Validate' },
              { n: 3, label: 'Review Summary' }
            ].map((s, i) => (
              <React.Fragment key={s.n}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '14px',
                    backgroundColor: step === s.n ? '#8B1A1A' : step > s.n ? '#166534' : 'white',
                    color: step >= s.n ? 'white' : '#9CA3AF',
                    border: step < s.n ? '2px solid #D1D5DB' : 'none'
                  }}>
                    {step > s.n ? '✓' : s.n}
                  </div>
                  <span style={{ 
                    marginTop: '8px', fontSize: '12px', 
                    color: step >= s.n ? '#8B1A1A' : '#9CA3AF',
                    fontWeight: step === s.n ? '600' : '400',
                    whiteSpace: 'nowrap'
                  }}>
                    {s.label}
                  </span>
                </div>
                {i < 2 && (
                  <div style={{
                    width: '80px', height: '2px',
                    backgroundColor: step > s.n ? '#166534' : '#D1D5DB',
                    margin: '0 15px',
                    marginTop: '-20px'
                  }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Period Selection */}
          {step === 1 && (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              marginBottom: '16px'
            }}>
              {!periodConfirmed ? (
                <>
                  <h3 style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '16px', marginBottom: '16px' }}>
                    Select Upload Period
                  </h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Financial Year</label>
                      <select 
                        value={selectedFY}
                        onChange={(e) => {
                          setSelectedFY(e.target.value);
                          setPeriodError(false);
                          setSubmitError(null);
                        }}
                        style={{
                          width: '100%',
                          border: periodError && !selectedFY ? '1px solid #DC2626' : '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: periodError && !selectedFY ? '#FEF2F2' : '#F8FAFC'
                        }}
                      >
                        <option value="">Select FY</option>
                        <option>FY 2025-26</option>
                        <option>FY 2024-25</option>
                        <option>FY 2023-24</option>
                        <option>FY 2022-23</option>
                      </select>
                      {periodError && !selectedFY && (
                        <p style={{ color: '#DC2626', fontSize: '11px', fontWeight: '500', marginTop: '4px' }}>
                          ⚠ Please select a Financial Year
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quarter</label>
                      <select 
                        value={selectedQuarter}
                        onChange={(e) => {
                          setSelectedQuarter(e.target.value);
                          setPeriodError(false);
                          setSubmitError(null);
                        }}
                        style={{
                          width: '100%',
                          border: periodError && !selectedQuarter ? '1px solid #DC2626' : '1px solid #E2E8F0',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          fontSize: '14px',
                          outline: 'none',
                          backgroundColor: periodError && !selectedQuarter ? '#FEF2F2' : '#F8FAFC'
                        }}
                      >
                        <option value="">Select Quarter</option>
                        <option>Q1</option>
                        <option>Q2</option>
                        <option>Q3</option>
                        <option>Q4</option>
                      </select>
                      {periodError && !selectedQuarter && (
                        <p style={{ color: '#DC2626', fontSize: '11px', fontWeight: '500', marginTop: '4px' }}>
                          ⚠ Please select a Quarter
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                    <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Select the period for which you want to upload the BENPOS data. 
                      The system will automatically run the inactivation sequence for the chosen period.
                    </p>
                  </div>

                  <Button 
                    onClick={handleConfirmPeriod}
                    className="w-full bg-[#8B1A1A] hover:bg-[#6B1010] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                  >
                    Confirm Period <ArrowRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <div style={{
                    backgroundColor: '#F9F9F9',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{
                        backgroundColor: '#FDF0F0',
                        border: '1px solid #D4A0A0',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        color: '#8B1A1A',
                        fontWeight: '500'
                      }}>
                        📅 {selectedFY}
                      </span>
                      <span style={{
                        backgroundColor: '#FDF0F0',
                        border: '1px solid #D4A0A0',
                        borderRadius: '20px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        color: '#8B1A1A',
                        fontWeight: '500'
                      }}>
                        📋 {selectedQuarter}
                      </span>
                    </div>
                    
                    <div 
                      style={{ color: '#8B1A1A', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}
                      onClick={() => {
                        setPeriodConfirmed(false);
                        setSelectedFY('');
                        setSelectedQuarter('');
                        setStep(1);
                        setFileProcessed(false);
                        setFileSelected(null);
                      }}
                    >
                      ← Change Period
                    </div>
                  </div>

                  {quarterStatus === 'approved' && (
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #86EFAC',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}>
                      <CheckCircle size={24} color='#166534' style={{ flexShrink: 0 }} />
                      <div>
                        <h4 style={{ fontWeight: 'bold', color: '#166534', fontSize: '15px', marginBottom: '6px', margin: 0 }}>
                          Upload Blocked — Already Approved
                        </h4>
                        <p style={{ color: '#166534', fontSize: '13px', margin: 0 }}>
                          BENPOS for {selectedQuarter} {selectedFY} has been approved and is active. Re-upload is not permitted.
                        </p>
                      </div>
                    </div>
                  )}

                  {quarterStatus === 'pending' && (
                    <div style={{
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #F59E0B',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '14px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <Clock size={24} color='#D97706' style={{ flexShrink: 0 }} />
                        <div>
                          <h4 style={{ fontWeight: 'bold', color: '#92400E', fontSize: '15px', marginBottom: '6px', margin: 0 }}>
                            Submission Already Pending
                          </h4>
                          <p style={{ color: '#92400E', fontSize: '13px', margin: 0 }}>
                            BENPOS for {selectedQuarter} {selectedFY} is currently awaiting approver review. You cannot upload again until a decision is made.
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/admin/approvals')}
                        style={{
                          border: '1px solid #D97706', color: '#D97706',
                          backgroundColor: 'white', borderRadius: '8px',
                          padding: '10px 14px', fontSize: '13px',
                          fontWeight: '600', cursor: 'pointer', flexShrink: 0
                        }}
                      >
                        View in Queue →
                      </button>
                    </div>
                  )}

                  {quarterStatus === 'rejected' && (
                    <div style={{
                      backgroundColor: '#FEF2F2',
                      border: '1px solid #FCA5A5',
                      borderRadius: '12px',
                      padding: '20px 24px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <XCircle size={20} color='#DC2626' style={{ flexShrink: 0 }} />
                        <h4 style={{ fontWeight: 'bold', color: '#DC2626', fontSize: '15px', margin: 0 }}>
                          Previous Submission Rejected — Upload Revised File
                        </h4>
                      </div>
                      
                      <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px', border: '1px solid #FCA5A5' }}>
                        <p style={{ fontSize: '13px', margin: 0 }}>
                          <span style={{ color: '#9CA3AF' }}>Reason:</span> <span style={{ color: '#DC2626', fontWeight: 'bold' }}>{benposRejection?.reason}</span>
                        </p>
                        <p style={{ fontSize: '13px', marginTop: '6px', margin: 0 }}>
                          <span style={{ color: '#9CA3AF' }}>Comments:</span> <span style={{ color: '#374151' }}>{benposRejection?.comment}</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {quarterStatus === 'open' && (
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #86EFAC',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <CheckCircle size={16} color='#166534' style={{ flexShrink: 0 }} />
                      <p style={{ color: '#166534', fontSize: '13px', fontWeight: '500', margin: 0 }}>
                        Period confirmed — {selectedQuarter} {selectedFY} is ready for upload.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step Indicator Section (moved down or kept as is) */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6" style={{ display: periodConfirmed ? 'block' : 'none' }}>
              {true && (
                <>
                  {showPreProcess ? (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '40px 32px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  textAlign: 'center'
                }}>
                  <style>{`
                    @keyframes spin { to { transform: rotate(360deg); } }
                  `}</style>
                  
                  <div style={{
                    width: '56px', height: '56px',
                    backgroundColor: '#FDF0F0',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <div style={{
                      width: '28px', height: '28px',
                      border: '3px solid #FDF0F0',
                      borderTop: '3px solid #8B1A1A',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}/>
                  </div>
                  
                  <h3 style={{ 
                    fontWeight: 'bold', fontSize: '17px', 
                    color: '#1A1A1A', marginBottom: '4px' 
                  }}>
                    Preparing System for Upload
                  </h3>
                  <p style={{ 
                    color: '#6B7280', fontSize: '13px', 
                    marginBottom: '32px' 
                  }}>
                    Running inactivation sequence for {selectedQuarter} {selectedFY}...
                  </p>

                  <div style={{ 
                    textAlign: 'left', 
                    maxWidth: '420px', 
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    {[
                      { 
                        title: "Marking All Records Inactive", 
                        pendingSub: "1,248 existing investor records → Inactive",
                        completeSub: "1,248 records marked Inactive ✓"
                      },
                      { 
                        title: "Resetting Unit Holdings to Zero", 
                        pendingSub: "Clearing all unit balances before new upload",
                        completeSub: "All unit holdings reset to 0 ✓"
                      },
                      { 
                        title: "Processing New BENPOS File", 
                        pendingSub: "Validating and mapping 1,108 records from file",
                        completeSub: "1,108 records processed — ready for review ✓"
                      }
                    ].map((item, n) => (
                      <div key={n} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '14px 16px',
                        borderRadius: '12px',
                        backgroundColor: preProcessStep > n ? '#F0FDF4' : 
                          preProcessStep === n ? '#FDF0F0' : '#F9F9F9',
                        border: preProcessStep > n ? '1px solid #86EFAC' :
                          preProcessStep === n ? '1px solid #D4A0A0' : 
                          '1px solid #F3F4F6',
                        transition: 'all 0.4s ease'
                      }}>
                        <div style={{
                          width: '32px', height: '32px', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: preProcessStep > n ? '#166534' : 
                            preProcessStep === n ? '#8B1A1A' : '#E5E7EB',
                          color: preProcessStep >= n ? 'white' : '#9CA3AF',
                          fontWeight: 'bold', fontSize: '13px'
                        }}>
                          {preProcessStep > n ? '✓' : 
                           preProcessStep === n ? (
                             <div style={{
                               width: '14px', height: '14px',
                               border: '2px solid rgba(255,255,255,0.3)',
                               borderTop: '2px solid white',
                               borderRadius: '50%',
                               animation: 'spin 0.8s linear infinite'
                             }}/>
                           ) : (n + 1)}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <p style={{ 
                            fontWeight: '600', fontSize: '14px',
                            color: preProcessStep >= n ? '#1A1A1A' : '#9CA3AF',
                            marginBottom: '2px',
                            margin: 0
                          }}>
                            {item.title}
                          </p>
                          <p style={{ 
                            fontSize: '12px',
                            margin: 0,
                            color: preProcessStep > n ? '#166534' : 
                              preProcessStep === n ? '#8B1A1A' : '#9CA3AF'
                          }}>
                            {preProcessStep > n ? item.completeSub : item.pendingSub}
                          </p>
                        </div>
                        
                        <div style={{ 
                          fontWeight: preProcessStep === n ? '500' : '600', 
                          fontSize: '12px',
                          color: preProcessStep > n ? '#166534' : 
                            preProcessStep === n ? '#8B1A1A' : '#9CA3AF'
                        }}>
                          {preProcessStep > n ? "✓ Complete" : 
                           preProcessStep === n ? "Running..." : "Pending"}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    backgroundColor: '#F3F4F6',
                    borderRadius: '99px',
                    height: '6px',
                    marginTop: '24px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: '#8B1A1A',
                      borderRadius: '99px',
                      width: preProcessStep === 0 ? '15%' :
                             preProcessStep === 1 ? '45%' :
                             preProcessStep === 2 ? '75%' : '100%',
                      transition: 'width 0.6s ease'
                    }}/>
                  </div>
                  <p style={{ 
                    color: '#6B7280', fontSize: '12px', 
                    marginTop: '8px', textAlign: 'right' 
                  }}>
                    {preProcessStep === 0 ? '15%' :
                     preProcessStep === 1 ? '45%' :
                     preProcessStep === 2 ? '75%' : '100%'} complete
                  </p>

                  <p style={{ 
                    fontSize: '12px', color: '#9CA3AF',
                    fontStyle: 'italic', marginTop: '20px'
                  }}>
                    This process runs automatically on every 
                    quarterly BENPOS upload to ensure only 
                    current unit holders are active.
                  </p>
                </div>
              ) : (
                <Card>
                  <div 
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-12 text-center transition-all",
                      isDragging ? "border-[#8B1A1A] bg-[#FDF0F0]" : "border-slate-200 hover:border-slate-300"
                    )}
                  >
                    {validationState === 'validating' ? (
                      <div className="flex flex-col items-center py-4">
                        <Loader2 className="h-12 w-12 text-[#8B1A1A] animate-spin mb-6" />
                        <div className="space-y-3 text-left w-full max-w-xs mx-auto">
                          {validationSteps.map((step, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-[#1A1A1A] animate-in fade-in slide-in-from-left-2 duration-300">
                              <CheckCircle className="h-4 w-4 text-[#8B1A1A]" />
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-[#1A1A1A]">Click or drag files to upload</h3>
                        <p className="text-sm text-slate-500 mt-2">Support for .csv and .xlsx files (Max 50MB)</p>
                        <input 
                          key={uploadKey}
                          type="file" 
                          className="hidden" 
                          id="benpos-file-upload"
                          onChange={handleFileChange} 
                          accept=".csv,.xlsx,.xls" 
                        />
                        <div className="flex justify-center gap-3 mt-8">
                          <button
                            onClick={() => {
                              if (!fileSelected) {
                                document.getElementById('benpos-file-upload')?.click();
                              }
                            }}
                            disabled={!!fileSelected}
                            style={{
                              backgroundColor: fileSelected ? '#E5E7EB' : '#8B1A1A',
                              color: fileSelected ? '#9CA3AF' : 'white',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '10px 24px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: fileSelected ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            {fileSelected ? '✓ File Selected' : 'Select Files'}
                          </button>
                          <button
                            onClick={() => {
                              if (!fileSelected || fileProcessed) return;
                              handleUpload();
                            }}
                            disabled={!fileSelected || fileProcessed}
                            style={{
                              backgroundColor: fileProcessed ? '#E5E7EB' : !fileSelected ? '#E5E7EB' : '#8B1A1A',
                              color: fileProcessed || !fileSelected ? '#9CA3AF' : 'white',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '10px 24px',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: fileProcessed || !fileSelected ? 'not-allowed' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}
                          >
                            {fileProcessed ? '✓ File Processed' : 'Process File →'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {fileSelected && validationState !== 'validating' && (
                    <div style={{
                      backgroundColor: '#F0FDF4',
                      border: '1px solid #86EFAC',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={16} color="#166534" />
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: '600', color: '#1A1A1A', margin: 0 }}>{fileSelected.name}</p>
                          <p style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px', margin: 0 }}>{fileSelected.size}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          backgroundColor: '#F0FDF4',
                          color: '#166534',
                          border: '1px solid #86EFAC',
                          borderRadius: '20px',
                          padding: '3px 10px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>✓ Ready</span>
                        {!fileProcessed && (
                          <button
                            onClick={() => setFileSelected(null)}
                            style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', marginLeft: '8px', padding: '4px' }}
                          >×</button>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

            {showSummary && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4 shadow-sm relative">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-[#8B1A1A]">Upload Summary</h3>
                      <Badge variant="neutral" className="bg-[#FDF0F0] text-[#8B1A1A] border-[#D4A0A0]">
                        {selectedQuarter} {selectedFY}
                      </Badge>
                    </div>
                    <button 
                      onClick={handleReset}
                      className="flex items-center gap-2 border border-[#D4A0A0] text-[#8B1A1A] rounded-lg px-4 py-2 text-sm hover:bg-[#FDF0F0] transition-colors font-bold"
                    >
                      <ArrowRight className="h-4 w-4 rotate-180" /> Upload New File
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-[#FDF0F0] rounded-xl border border-[#D4A0A0]">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Records</p>
                      <p className="text-2xl font-bold text-[#8B1A1A] mt-1">48</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modified Records</p>
                      <p className="text-2xl font-bold text-[#1A1A1A] mt-1">1,054</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                      <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Rejected Records</p>
                      <p className="text-2xl font-bold text-[#ef4444] mt-1">3</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Date/Time</p>
                      <p className="text-sm font-bold text-slate-900 mt-2">{uploadTime}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#8B1A1A] font-bold text-sm">
                      <XCircle className="h-4 w-4 text-[#ef4444]" /> Rejected Records
                    </div>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#8B1A1A] text-white">
                          <tr>
                            <th className="px-4 py-3 font-semibold">DPCLIENTID</th>
                            <th className="px-4 py-3 font-semibold">Issue</th>
                            <th className="px-4 py-3 font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rejectedRecords.map((record, i) => (
                            <tr key={i} className={cn(i % 2 !== 0 ? "bg-[#FDF0F0]" : "bg-white")}>
                              <td className="px-4 py-3 font-bold text-slate-900">{record.id}</td>
                              <td className="px-4 py-3 text-red-600 font-medium">{record.reason}</td>
                              <td className="px-4 py-3">
                                <button className="text-[#8B1A1A] font-bold hover:underline">Ignore</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {showSummary && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 mt-4 shadow-sm">
                  <h3 className="text-lg font-bold text-[#8B1A1A] mb-6">Validation Report</h3>
                  
                  <div className="space-y-6">
                    {/* Section A */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-[#8B1A1A] text-white px-4 py-3 flex items-center justify-between">
                        <span className="font-bold text-sm flex items-center gap-2">
                          <span className="text-red-400">🔴</span> Duplicate DPCLIENTID Rejection (1 found)
                        </span>
                        <ChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                      <div className="p-4">
                        <div className="overflow-hidden rounded-lg border border-gray-200 mb-3">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-4 py-2 font-semibold">Row #</th>
                                <th className="px-4 py-2 font-semibold">DPCLIENTID</th>
                                <th className="px-4 py-2 font-semibold">Investor Name</th>
                                <th className="px-4 py-2 font-semibold">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t border-gray-100">
                                <td className="px-4 py-2">47</td>
                                <td className="px-4 py-2 font-bold">DPCL00891</td>
                                <td className="px-4 py-2">Mehta Securities Ltd</td>
                                <td className="px-4 py-2 text-red-600 font-medium">Excluded from upload</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="bg-red-50 rounded p-3 text-xs text-red-700 border border-red-100">
                          Duplicate DPCLIENTIDs are automatically excluded. Only the first occurrence is retained. Please correct your source file before re-uploading.
                        </div>
                      </div>
                    </div>

                    {/* Section B */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-[#8B1A1A] text-white px-4 py-3 flex items-center justify-between">
                        <span className="font-bold text-sm flex items-center gap-2">
                          <span className="text-red-400">🔴</span> Mandatory Field Errors (2 records)
                        </span>
                        <ChevronRight className="h-4 w-4 rotate-90" />
                      </div>
                      <div className="p-4">
                        <div className="overflow-hidden rounded-lg border border-gray-200 mb-4">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50">
                              <tr>
                                <th className="px-4 py-2 font-semibold">Row #</th>
                                <th className="px-4 py-2 font-semibold">DPCLIENTID</th>
                                <th className="px-4 py-2 font-semibold">Investor Name</th>
                                <th className="px-4 py-2 font-semibold">Missing Field</th>
                                <th className="px-4 py-2 font-semibold">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-t border-gray-100">
                                <td className="px-4 py-2">23</td>
                                <td className="px-4 py-2 font-bold">DPCL00234</td>
                                <td className="px-4 py-2">Kapoor Investments</td>
                                <td className="px-4 py-2 font-bold">TDS %</td>
                                <td className="px-4 py-2 text-red-600 font-medium">Excluded</td>
                              </tr>
                              <tr className="bg-[#FDF0F0] border-t border-gray-100">
                                <td className="px-4 py-2">89</td>
                                <td className="px-4 py-2 font-bold">DPCL01102</td>
                                <td className="px-4 py-2">Singh & Associates</td>
                                <td className="px-4 py-2 font-bold">PAN Number</td>
                                <td className="px-4 py-2 text-red-600 font-medium">Excluded</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        
                        <div className="bg-[#FDF0F0] rounded-lg p-4 border border-[#D4A0A0]">
                          <h4 className="text-[#8B1A1A] font-bold text-sm mb-3">Mandatory Fields Reference</h4>
                          <div className="grid grid-cols-2 gap-y-2">
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                              <CheckCircle className="h-3 w-3 text-[#8B1A1A]" /> DPCLIENTID
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                              <CheckCircle className="h-3 w-3 text-[#8B1A1A]" /> PAN Number
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                              <CheckCircle className="h-3 w-3 text-[#8B1A1A]" /> Investor Name
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                              <CheckCircle className="h-3 w-3 text-[#8B1A1A]" /> Unit Held
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                              <CheckCircle className="h-3 w-3 text-[#8B1A1A]" /> TDS %
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                              <CheckCircle className="h-3 w-3 text-[#8B1A1A]" /> Email ID
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                              <CheckCircle className="h-3 w-3 text-[#8B1A1A]" /> Mobile Number
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#1A1A1A]">
                              <CheckCircle className="h-3 w-3 text-[#8B1A1A]" /> Investor Category
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section C */}
                    <div className="bg-[#FDF0F0] rounded-lg p-4 grid grid-cols-3 gap-4 text-center border border-[#D4A0A0]">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Total Records in File</p>
                        <p className="text-lg font-bold text-[#1A1A1A]">1,108</p>
                      </div>
                      <div className="border-x border-[#D4A0A0]">
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Successfully Validated</p>
                        <p className="text-lg font-bold text-[#8B1A1A]">1,105</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Excluded (Errors)</p>
                        <p className="text-lg font-bold text-red-600">3</p>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6" style={{ display: periodConfirmed ? 'block' : 'none' }}>
              <div style={{ position: 'sticky', top: '24px' }}>
                <div style={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px',
                  padding: '20px 24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <p style={{ fontWeight: 'bold', color: '#8B1A1A', fontSize: '15px', marginBottom: '4px' }}>Actions</p>
                  <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '16px' }}>Finalize your upload</p>
                  <div style={{ borderTop: '1px solid #F3F4F6', marginBottom: '16px' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>Current Status</span>
                    <span style={{
                      backgroundColor: (benposSubmitted || benposPending) ? '#FEF3C7' : '#F3F4F6',
                      color: (benposSubmitted || benposPending) ? '#92400E' : '#6B7280',
                      borderRadius: '20px',
                      padding: '3px 10px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {(benposSubmitted || benposPending) ? '⏳ Pending Approval' : 'Ready to Submit'}
                    </span>
                  </div>
                  {step === 3 && (
                    <div style={{
                      backgroundColor: '#FDF0F0',
                      borderRadius: '10px',
                      padding: '12px',
                      marginBottom: '16px',
                      display: 'flex',
                      justifyContent: 'space-around',
                      textAlign: 'center'
                    }}>
                      <div>
                        <p style={{ fontWeight: 'bold', color: '#166534', fontSize: '16px', margin: 0 }}>1,105</p>
                        <p style={{ fontSize: '10px', color: '#166534', margin: 0 }}>Valid</p>
                      </div>
                      <div style={{ borderLeft: '1px solid #D4A0A0', margin: '0 8px' }} />
                      <div>
                        <p style={{ fontWeight: 'bold', color: '#DC2626', fontSize: '16px', margin: 0 }}>3</p>
                        <p style={{ fontSize: '10px', color: '#DC2626', margin: 0 }}>Excluded</p>
                      </div>
                      <div style={{ borderLeft: '1px solid #D4A0A0', margin: '0 8px' }} />
                      <div>
                        <p style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '16px', margin: 0 }}>1,108</p>
                        <p style={{ fontSize: '10px', color: '#6B7280', margin: 0 }}>Total</p>
                      </div>
                    </div>
                  )}
                  {(benposSubmitted || benposPending) ? (
                    <button disabled style={{
                      width: '100%',
                      backgroundColor: '#E5E7EB',
                      color: '#9CA3AF',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      ✓ Submitted for Approval
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitForApproval}
                      disabled={step !== 3}
                      style={{
                        width: '100%',
                        backgroundColor: step !== 3 ? '#E5E7EB' : '#8B1A1A',
                        color: step !== 3 ? '#9CA3AF' : 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '14px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: step !== 3 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      {step !== 3 ? '🔒 Complete Upload First' : 'Submit for Approval →'}
                    </button>
                  )}
                  <p style={{ fontSize: '11px', color: '#9CA3AF', textAlign: 'center', marginTop: '8px' }}>
                    {step !== 3
                      ? 'Upload and process a file to enable submission'
                      : 'Once submitted, data goes to approver for review'}
                  </p>
                </div>
              </div>

              <Card title="Download Template" subtitle="Use standard format for uploads">
                <div className="space-y-3 mt-4">
                  <Button variant="outline" className="w-full justify-between group">
                    CSV Template <FileSpreadsheet className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between group">
                    Excel Template <FileSpreadsheet className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#8B1A1A] text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Upload Date</th>
                  <th className="px-6 py-4 font-semibold">Quarter</th>
                  <th className="px-6 py-4 font-semibold">New</th>
                  <th className="px-6 py-4 font-semibold">Modified</th>
                  <th className="px-6 py-4 font-semibold">Rejected</th>
                  <th className="px-6 py-4 font-semibold">Uploaded By</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((row, i) => (
                  <tr key={i} className={cn(i % 2 !== 0 ? "bg-[#FDF0F0]" : "bg-white")}>
                    <td className="px-6 py-4 font-bold text-slate-900">{row.date}</td>
                    <td className="px-6 py-4">{row.quarter}</td>
                    <td className="px-6 py-4 font-bold text-[#8B1A1A]">{row.new}</td>
                    <td className="px-6 py-4 font-bold text-[#1A1A1A]">{row.modified}</td>
                    <td className="px-6 py-4 font-bold text-[#ef4444]">{row.rejected}</td>
                    <td className="px-6 py-4">{row.by}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold",
                        row.status === 'Approved' ? "bg-emerald-100 text-emerald-700" :
                        row.status === 'Pending Approval' ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => openHistoryModal(row)}
                        className="text-[#8B1A1A] font-bold hover:underline flex items-center gap-1"
                      >
                        View Summary <ChevronRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* History Summary Modal */}
      {showHistoryModal && selectedHistoryRow && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto pt-20 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-auto p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-[#8B1A1A]">Upload Summary</h3>
                <span className="bg-[#FDF0F0] text-[#8B1A1A] px-3 py-1 rounded-full text-xs font-semibold border border-[#D4A0A0]">
                  {selectedHistoryRow.quarter}
                </span>
              </div>
              <button onClick={() => setShowHistoryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-[#FDF0F0] rounded-xl border border-[#D4A0A0]">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New Records</p>
                <p className="text-2xl font-bold text-[#8B1A1A] mt-1">{selectedHistoryRow.new}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modified Records</p>
                <p className="text-2xl font-bold text-[#1A1A1A] mt-1">{selectedHistoryRow.modified}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Rejected Records</p>
                <p className={cn("text-2xl font-bold mt-1", selectedHistoryRow.rejected > 0 ? "text-red-600" : "text-slate-400")}>
                  {selectedHistoryRow.rejected}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Upload Date/Time</p>
                <p className="text-xs font-bold text-slate-900 mt-2">{selectedHistoryRow.date}</p>
              </div>
            </div>

            {selectedHistoryRow.rejected > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-bold text-[#8B1A1A] mb-3">Rejected Records</h4>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#8B1A1A] text-white">
                      <tr>
                        <th className="px-4 py-2 font-semibold">DPCLIENTID</th>
                        <th className="px-4 py-2 font-semibold">Issue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHistoryRow.rejectedDetails?.map((detail: any, i: number) => (
                        <tr key={i} className={cn(i % 2 !== 0 ? "bg-[#FDF0F0]" : "bg-white")}>
                          <td className="px-4 py-2 font-bold">{detail.id}</td>
                          <td className="px-4 py-2 text-red-600">{detail.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="mb-8">
              {selectedHistoryRow.status === 'Approved' ? (
                <div className="bg-[#FDF0F0] rounded-lg p-3 flex items-center gap-2 text-sm text-[#8B1A1A] border border-[#D4A0A0]">
                  <CheckCircle className="h-4 w-4 text-[#8B1A1A]" />
                  <span>Approved by <span className="font-bold">{selectedHistoryRow.approvedBy}</span> on {selectedHistoryRow.approvedOn}</span>
                </div>
              ) : selectedHistoryRow.status === 'Rejected' ? (
                <div className="bg-[#fee2e2] rounded-lg p-3 text-sm text-red-700 border border-red-100">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <XCircle className="h-4 w-4" /> Rejected by {selectedHistoryRow.rejectedBy}
                  </div>
                  <p className="text-xs">{selectedHistoryRow.rejectionReason}</p>
                  <p className="text-[10px] mt-2 opacity-70">Rejected on {selectedHistoryRow.rejectedOn}</p>
                </div>
              ) : (
                <div className="bg-[#fef3c7] rounded-lg p-3 flex items-center gap-2 text-sm text-amber-700 border border-amber-100">
                  <Clock className="h-4 w-4" />
                  <span>Awaiting Approver review</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="border border-gray-300 rounded-lg px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Detail Modal */}
      {showRejectionDetailModal && benposRejection && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowRejectionDetailModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-red-900">Rejection Details</h3>
              <p className="text-red-700 text-sm">BENPOS Master — Q3 FY 2025-26</p>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Reason for Rejection</p>
                <p className="text-red-900 font-semibold">{benposRejection.reason}</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Approver's Comments</p>
                <p className="text-slate-700 italic">"{benposRejection.comment}"</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <p>Rejected by: Rahul Sharma</p>
                <p>{benposRejection.rejectedAt}</p>
              </div>
            </div>

            <button 
              onClick={() => setShowRejectionDetailModal(false)}
              className="w-full mt-8 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
            >
              Close Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
