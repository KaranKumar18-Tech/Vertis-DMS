import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Play, 
  Info, 
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  Zap,
  Send,
  Lock,
  ArrowRight,
  AlertTriangle,
  Check,
  X,
  XCircle,
  Calendar,
  Loader2,
  Clock
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { useApprovals } from '../../context/ApprovalContext';

type ProcessState = 'ready' | 'processed' | 'submitted';

export const DistributionProcessing = () => {
  const navigate = useNavigate();
  const { submitForApproval, approvedItems, rejectedItems, clearRejection, notifications, pendingApprovals, isItemPending, isItemApproved, isItemRejected } = useApprovals();
  
  const [selectedFY, setSelectedFY] = useState('FY 2025-26');
  const [selectedQuarter, setSelectedQuarter] = useState('Q3');

  const approvalDates: Record<string, string> = {
    'Q2-FY2025-26': '03 Oct 2025',
    'Q1-FY2025-26': '02 Jul 2025',
    'Q4-FY2024-25': '06 Apr 2025',
    'Q3-FY2024-25': '04 Jan 2025',
    'Q2-FY2024-25': '05 Oct 2024',
    'Q1-FY2024-25': '03 Jul 2024',
    'Q4-FY2023-24': '05 Apr 2024',
    'Q3-FY2023-24': '04 Jan 2024',
    'Q2-FY2023-24': '03 Oct 2023',
    'Q1-FY2023-24': '04 Jul 2023'
  };

  const quarterStats: Record<string, { investors: string; net: string }> = {
    'Q2-FY2025-26': { investors: '1,098', net: '₹43,120.50' },
    'Q1-FY2025-26': { investors: '1,095', net: '₹41,368.75' },
    'Q4-FY2024-25': { investors: '1,085', net: '₹38,940.00' },
    'Q3-FY2024-25': { investors: '1,078', net: '₹37,215.50' },
    'Q2-FY2024-25': { investors: '1,070', net: '₹36,890.00' },
    'Q1-FY2024-25': { investors: '1,062', net: '₹35,425.75' },
    'Q4-FY2023-24': { investors: '1,050', net: '₹34,100.00' },
    'Q3-FY2023-24': { investors: '1,042', net: '₹33,650.25' },
    'Q2-FY2023-24': { investors: '1,035', net: '₹32,980.50' },
    'Q1-FY2023-24': { investors: '1,028', net: '₹31,750.00' }
  };

  const getPrerequisiteStatus = (type: string, quarter: string, fy: string) => {
    const lockedQuarters = [
      'Q1-FY2022-23', 'Q2-FY2022-23', 'Q3-FY2022-23', 'Q4-FY2022-23',
      'Q1-FY2023-24', 'Q2-FY2023-24', 'Q3-FY2023-24', 'Q4-FY2023-24',
      'Q1-FY2024-25', 'Q2-FY2024-25', 'Q3-FY2024-25', 'Q4-FY2024-25',
      'Q1-FY2025-26', 'Q2-FY2025-26'
    ];
    const key = `${quarter}-${fy.replace(' ', '')}`;
    if (lockedQuarters.includes(key)) return 'historical';
    if (isItemApproved(type, quarter, fy)) return 'approved';
    if (isItemPending(type, quarter, fy)) return 'pending';
    if (isItemRejected(type, quarter, fy)) return 'rejected';
    return 'not-started';
  };

  const benposStatus = getPrerequisiteStatus('benpos', selectedQuarter, selectedFY);
  const distMasterStatus = getPrerequisiteStatus('distribution-master', selectedQuarter, selectedFY);
  
  const isHistorical = benposStatus === 'historical' && distMasterStatus === 'historical';
  const canProcess = benposStatus === 'approved' && distMasterStatus === 'approved';

  const isProcessingApproved = approvedItems.includes(`distribution-processing-${selectedQuarter}-${selectedFY.replace(' ', '')}`);
  const processingNotif = notifications.find(
    n => n.itemId === `distribution-processing-${selectedQuarter}-${selectedFY.replace(' ', '')}` && n.type === 'approval'
  );

  const [processState, setProcessState] = useState<ProcessState>('ready');
  const processingPending = isItemPending('distribution-processing', selectedQuarter, selectedFY);
  const processingApproved = approvedItems.includes(`distribution-processing-${selectedQuarter}-${selectedFY.replace(' ', '')}`);
  const processingRejected = rejectedItems[`distribution-processing-${selectedQuarter}-${selectedFY.replace(' ', '')}`];
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLogic, setShowLogic] = useState(true);
  const [processingSubmitted, setProcessingSubmitted] = useState(false);
  const [showReviewBanner, setShowReviewBanner] = useState(false);
  const [showRejectionDetailModal, setShowRejectionDetailModal] = useState(false);
  const [checks, setChecks] = useState({
    count: false,
    rate: false,
    tds: false,
    totals: false
  });

  const processingRejection = rejectedItems[`distribution-processing-${selectedQuarter}-${selectedFY.replace(' ', '')}`];

  const handleProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setProcessState('processed');
    }, 1500);
  };

  const handleSubmitClick = () => {
    setShowModal(true);
  };

  const handleConfirmSubmit = () => {
    const itemId = `distribution-processing-${selectedQuarter}-${selectedFY.replace(' ', '')}`;
    if (processingRejection) {
      clearRejection(itemId);
    }
    submitForApproval({
      id: itemId,
      type_key: 'distribution-processing',
      quarter: selectedQuarter,
      fy: selectedFY,
      type: 'Distribution Processing',
      title: `Distribution Processing — ${selectedQuarter} ${selectedFY}`,
      stats: [
        { label: 'TOTAL INVESTORS', value: '1,102', color: '#8B1A1A' },
        { label: 'GROSS DIVIDEND', value: '₹49,437.50', color: '#1A1A1A' },
        { label: 'TOTAL TDS', value: '₹8,068.75', color: '#DC2626' },
        { label: 'NET PAYABLE', value: '₹41,368.75', color: '#166534' }
      ],
      timer: 'Just submitted',
      gridCols: 4
    });
    setProcessingSubmitted(true);
    setShowModal(false);
    setShowReviewBanner(false);
    setProcessState('submitted');
  };

  const results = [
    { id: 'DPCL00101', name: 'Rajesh Kumar Iyer', units: 5000, rate: 0.1250, gross: 625.00, tdsRate: 10, tdsAmt: 62.50, net: 562.50 },
    { id: 'DPCL00102', name: 'Priya Sharma', units: 12000, rate: 0.1250, gross: 1500.00, tdsRate: 10, tdsAmt: 150.00, net: 1350.00 },
    { id: 'DPCL00103', name: 'Krishnamurthy Ventures Pvt Ltd', units: 250000, rate: 0.1250, gross: 31250.00, tdsRate: 20, tdsAmt: 6250.00, net: 25000.00 },
    { id: 'DPCL00104', name: 'Sunita Deshmukh', units: 8500, rate: 0.1250, gross: 1062.50, tdsRate: 10, tdsAmt: 106.25, net: 956.25 },
    { id: 'DPCL00105', name: 'Vikram Singh Rathore', units: 15000, rate: 0.1250, gross: 1875.00, tdsRate: 10, tdsAmt: 187.50, net: 1687.50 },
    { id: 'DPCL00106', name: 'Ananya Investments Pvt Ltd', units: 42000, rate: 0.1250, gross: 5250.00, tdsRate: 10, tdsAmt: 525.00, net: 4725.00 },
    { id: 'DPCL00107', name: 'Sharma Capital Pvt Ltd', units: 60000, rate: 0.1250, gross: 7500.00, tdsRate: 10, tdsAmt: 750.00, net: 6750.00 },
    { id: 'DPCL00108', name: 'Kapoor Investment Trust', units: 3000, rate: 0.1250, gross: 375.00, tdsRate: 10, tdsAmt: 37.50, net: 337.50 },
  ];

  const totals = results.reduce((acc, curr) => ({
    units: acc.units + curr.units,
    gross: acc.gross + curr.gross,
    tdsAmt: acc.tdsAmt + curr.tdsAmt,
    net: acc.net + curr.net
  }), { units: 0, gross: 0, tdsAmt: 0, net: 0 });

  if (processState === 'submitted') {
    return (
      <div className="max-w-4xl mx-auto py-12">
        {/* Success Banner */}
        <div style={{
          backgroundColor: '#F0FDF4',
          border: '1px solid #86EFAC',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <p style={{ fontWeight: 'bold', color: '#166534', margin: 0 }}>
            ✅ Distribution Processing submitted for approval
          </p>
          <p style={{ color: '#166534', fontSize: '13px', marginTop: '4px', margin: 0 }}>
            Awaiting review by approver. You can track status in the Approval Queue.
          </p>
        </div>

        <Card className="text-center py-16 px-8">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-[#FDF0F0] rounded-full flex items-center justify-center mb-6">
              <Lock className="h-10 w-10 text-[#8B1A1A]" />
            </div>
            <h3 className="text-3xl font-bold text-[#8B1A1A] mb-3">{selectedQuarter} ${selectedFY} Processing Submitted!</h3>
            <p className="text-[#1A1A1A] text-lg mb-6 max-w-2xl mx-auto">
              Distribution processing for 1,102 investors has been submitted to the Approver for final approval.
            </p>
            <div className="bg-[#fef3c7] text-[#92400e] rounded-full px-6 py-2 font-bold text-sm mb-10 border border-[#F59E0B]">
              Pending Approval
            </div>
            
            <div className="w-full grid grid-cols-3 gap-6 mb-10">
              <div className="bg-[#FDF0F0] rounded-2xl p-6 text-center border border-[#D4A0A0]">
                <p className="text-xs font-bold text-[#8B1A1A] uppercase tracking-wider mb-1">Total Investors</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">1,102</p>
              </div>
              <div className="bg-[#FDF0F0] rounded-2xl p-6 text-center border border-[#D4A0A0]">
                <p className="text-xs font-bold text-[#8B1A1A] uppercase tracking-wider mb-1">Total Gross Dividend</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">₹49,437.50</p>
              </div>
              <div className="bg-[#FDF0F0] rounded-2xl p-6 text-center border border-[#D4A0A0]">
                <p className="text-xs font-bold text-[#8B1A1A] uppercase tracking-wider mb-1">Total Net Payable</p>
                <p className="text-2xl font-bold text-[#1A1A1A]">₹41,368.75</p>
              </div>
            </div>

            <div className="w-full bg-white border border-gray-100 rounded-2xl p-8 text-left mb-10 shadow-sm">
              <h4 className="text-[#8B1A1A] font-bold text-lg mb-4">What happens next?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#8B1A1A] rounded-full flex items-center justify-center text-white shrink-0">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-slate-600">Approver will verify all calculations</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#8B1A1A] rounded-full flex items-center justify-center text-white shrink-0">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-slate-600">Once approved, {selectedQuarter} will be permanently locked</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#8B1A1A] rounded-full flex items-center justify-center text-white shrink-0">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-slate-600">Investors will be able to view their reports</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#8B1A1A] rounded-full flex items-center justify-center text-white shrink-0">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-slate-600">Tax documents can be uploaded after approval</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => navigate('/admin/approvals')}
              className="px-12 py-4 bg-[#8B1A1A] text-white rounded-xl font-bold hover:bg-[#6B1010] transition-all shadow-lg shadow-[#8B1A1A]/20 flex items-center gap-2"
            >
              Go to Approval Queue <ArrowRight className="h-5 w-5" />
            </button>
            
            <p className="text-xs text-gray-400 mt-6 flex items-center gap-1">
              <Lock className="h-3 w-3" /> This quarter cannot be reprocessed after approval.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector Bar */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '14px',
        padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} color='#8B1A1A' />
          <span style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '14px' }}>
            Select Processing Period:
          </span>
        </div>
        
        <select 
          value={selectedFY}
          onChange={(e) => setSelectedFY(e.target.value)}
          style={{
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: '#1A1A1A',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option>FY 2025-26</option>
          <option>FY 2024-25</option>
          <option>FY 2023-24</option>
          <option>FY 2022-23</option>
        </select>
        
        <select 
          value={selectedQuarter}
          onChange={(e) => setSelectedQuarter(e.target.value)}
          style={{
            border: '1px solid #D1D5DB',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '13px',
            color: '#1A1A1A',
            backgroundColor: 'white',
            cursor: 'pointer'
          }}
        >
          <option>Q1</option>
          <option>Q2</option>
          <option>Q3</option>
          <option>Q4</option>
        </select>
        
        <div style={{
          marginLeft: 'auto',
          backgroundColor: '#FDF0F0',
          border: '1px solid #D4A0A0',
          borderRadius: '20px',
          padding: '6px 16px',
          fontSize: '13px',
          color: '#8B1A1A',
          fontWeight: '600'
        }}>
          Processing: {selectedQuarter} {selectedFY}
        </div>
      </div>

      {/* Rejection Banner */}
      {processingRejection && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-red-900">Submission Rejected</h3>
                <Badge variant="error" className="text-red-600 border-red-200 bg-red-50">
                  Rejected on {processingRejection.rejectedAt}
                </Badge>
              </div>
              <p className="text-red-800 font-semibold mb-1">Reason: {processingRejection.reason}</p>
              <p className="text-red-700 text-sm mb-4 italic">"{processingRejection.comment}"</p>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => {
                    clearRejection(`distribution-processing-${selectedQuarter}-${selectedFY.replace(' ', '')}`);
                    setProcessingSubmitted(false);
                    setShowReviewBanner(true);
                    setProcessState('processed');
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6"
                >
                  Review & Resubmit
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

      <div>
        <h2 className="text-2xl font-bold text-[#8B1A1A]">Distribution Processing</h2>
        <p className="text-[#1A1A1A] mt-1">Execute and review quarterly distribution calculations</p>
      </div>

      {isProcessingApproved && (selectedFY === 'FY 2025-26' && selectedQuarter === 'Q3') && (
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
              <h3 style={{ fontWeight: 'bold', color: '#166534', fontSize: '16px', margin: 0 }}>Distribution Processing — Finalized & Locked</h3>
              <p style={{ color: '#166534', fontSize: '13px', marginTop: '2px', opacity: 0.85, margin: 0 }}>
                {selectedQuarter} {selectedFY} — ₹41,368.75 net distribution approved. Quarter is permanently locked. Reports are now available.
              </p>
              {processingNotif && (
                <p style={{ color: '#166534', fontSize: '12px', marginTop: '4px', opacity: 0.7, margin: 0 }}>
                  Approved by {processingNotif.approvedBy} on {processingNotif.approvedAt}
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
            🔒 Finalized
          </div>
        </div>
      )}

      {isHistorical ? (
        <div style={{
          backgroundColor: '#F3F4F6',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center'
        }}>
          <Lock size={40} color='#6B7280' style={{ margin: '0 auto' }} />
          
          <h2 style={{ fontWeight: 'bold', fontSize: '18px', color: '#374151', marginTop: '16px' }}>
            Quarter Already Processed & Locked
          </h2>
          
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px', maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
            {selectedQuarter} {selectedFY} distribution has been approved and permanently finalized.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Investors</p>
              <p className="text-lg font-bold text-[#1A1A1A]">{quarterStats[`${selectedQuarter}-${selectedFY.replace(' ', '')}`]?.investors || '1,102'}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Net Distributed</p>
              <p className="text-lg font-bold text-[#166534]">{quarterStats[`${selectedQuarter}-${selectedFY.replace(' ', '')}`]?.net || '₹41,368.75'}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Approved On</p>
              <p className="text-lg font-bold text-[#1A1A1A]">{approvalDates[`${selectedQuarter}-${selectedFY.replace(' ', '')}`] || '-'}</p>
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            padding: '14px',
            marginTop: '20px',
            fontSize: '13px',
            color: '#6B7280',
            maxWidth: '480px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            🔒 This quarter is permanently locked. No reprocessing, modification, or re-upload is permitted. View the finalized data in Reports.
          </div>
          
          <button 
            onClick={() => navigate('/admin/reports')}
            style={{
              marginTop: '16px',
              border: '1px solid #8B1A1A',
              color: '#8B1A1A',
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: '600'
            }}
          >
            View in Reports →
          </button>
        </div>
      ) : !canProcess ? (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', 
            gap: '12px', marginBottom: '8px' 
          }}>
            <Lock className="h-6 w-6 text-[#8B1A1A]" />
            <h2 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1A1A1A' }}>
              Pre-Requisites Not Met
            </h2>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>
            The following approvals must be completed before distribution processing can begin.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* CARD 1 — BENPOS Master */}
            {benposStatus === 'historical' ? (
              <div style={{
                border: '1px solid #D1D5DB',
                backgroundColor: '#F3F4F6',
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: 0.85
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Lock size={18} color='#6B7280' />
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#374151', fontSize: '15px' }}>
                      BENPOS Master ({selectedQuarter} {selectedFY})
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>
                      {selectedQuarter} {selectedFY} — Approved & locked
                    </p>
                    <p style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '2px' }}>
                      Distribution processed and finalized
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    backgroundColor: '#E5E7EB',
                    color: '#6B7280',
                    border: '1px solid #D1D5DB',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    🔒 Locked
                  </span>
                  <p style={{ color: '#9CA3AF', fontSize: '11px' }}>
                    Approved {approvalDates[`${selectedQuarter}-${selectedFY.replace(' ', '')}`] || ''}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                borderRadius: '14px',
                border: benposStatus === 'approved' ? '1px solid #86EFAC'
                      : benposStatus === 'pending'   ? '1px solid #F59E0B'
                      : benposStatus === 'rejected'  ? '1px solid #FCA5A5'
                      : '1px solid #D1D5DB',
                backgroundColor: benposStatus === 'approved' ? '#F0FDF4'
                               : benposStatus === 'pending'   ? '#FFFBEB'
                               : benposStatus === 'rejected'  ? '#FEF2F2'
                               : '#F9F9F9',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: benposStatus === 'approved' ? '#166534'
                                   : benposStatus === 'pending'   ? '#D97706'
                                   : benposStatus === 'rejected'  ? '#DC2626'
                                   : '#9CA3AF'
                  }}>
                    {benposStatus === 'approved' ? <Check className="h-5 w-5 text-white" />
                   : benposStatus === 'pending'  ? <Clock className="h-5 w-5 text-white" />
                   : benposStatus === 'rejected' ? <X className="h-5 w-5 text-white" />
                   : <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>—</span>}
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '15px',
                      color: benposStatus === 'approved' ? '#166534'
                           : benposStatus === 'pending'   ? '#92400E'
                           : benposStatus === 'rejected'  ? '#DC2626'
                           : '#6B7280' }}>
                      BENPOS Master ({selectedQuarter} {selectedFY})
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>
                      {selectedQuarter} {selectedFY} — 1,108 records
                    </p>
                  </div>
                </div>

                {benposStatus === 'approved' ? (
                  <span style={{
                    backgroundColor: '#F0FDF4', color: '#166534',
                    borderRadius: '20px', padding: '6px 14px',
                    fontSize: '13px', fontWeight: '600', border: '1px solid #86EFAC'
                  }}>
                    ✅ Approved & Active
                  </span>
                ) : benposStatus === 'pending' ? (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: '#FFFBEB', color: '#92400E',
                      borderRadius: '20px', padding: '6px 14px',
                      fontSize: '13px', fontWeight: '600', border: '1px solid #F59E0B',
                      display: 'block', marginBottom: '8px'
                    }}>
                      ⏳ Pending Approval
                    </span>
                    <a onClick={() => navigate('/admin/approvals')}
                      style={{ color: '#8B1A1A', fontSize: '12px', cursor: 'pointer', fontWeight: '500', textDecoration: 'underline' }}>
                      Go to Approval Queue →
                    </a>
                  </div>
                ) : benposStatus === 'rejected' ? (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: '#FEF2F2', color: '#DC2626',
                      borderRadius: '20px', padding: '6px 14px',
                      fontSize: '13px', fontWeight: '600', border: '1px solid #FCA5A5',
                      display: 'block', marginBottom: '8px'
                    }}>
                      ❌ Rejected
                    </span>
                    <a onClick={() => navigate('/admin/benpos-upload')}
                      style={{ color: '#8B1A1A', fontSize: '12px', cursor: 'pointer', fontWeight: '500', textDecoration: 'underline' }}>
                      Go to BENPOS Master →
                    </a>
                  </div>
                ) : (
                  <span style={{
                    backgroundColor: '#F3F4F6', color: '#9CA3AF',
                    borderRadius: '20px', padding: '6px 14px',
                    fontSize: '13px', fontWeight: '600', border: '1px solid #D1D5DB'
                  }}>
                    — Not Submitted
                  </span>
                )}
              </div>
            )}

            {/* CARD 2 — Distribution Master */}
            {distMasterStatus === 'historical' ? (
              <div style={{
                border: '1px solid #D1D5DB',
                backgroundColor: '#F3F4F6',
                borderRadius: '14px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: 0.85
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Lock size={18} color='#6B7280' />
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', color: '#374151', fontSize: '15px' }}>
                      Distribution Master ({selectedQuarter} {selectedFY})
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>
                      {selectedQuarter} {selectedFY} — Approved & locked
                    </p>
                    <p style={{ color: '#9CA3AF', fontSize: '11px', marginTop: '2px' }}>
                      Distribution processed and finalized
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    backgroundColor: '#E5E7EB',
                    color: '#6B7280',
                    border: '1px solid #D1D5DB',
                    borderRadius: '20px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '6px'
                  }}>
                    🔒 Locked
                  </span>
                  <p style={{ color: '#9CA3AF', fontSize: '11px' }}>
                    Approved {approvalDates[`${selectedQuarter}-${selectedFY.replace(' ', '')}`] || ''}
                  </p>
                </div>
              </div>
            ) : (
              <div style={{
                borderRadius: '14px',
                border: distMasterStatus === 'approved' ? '1px solid #86EFAC'
                      : distMasterStatus === 'pending'   ? '1px solid #F59E0B'
                      : distMasterStatus === 'rejected'  ? '1px solid #FCA5A5'
                      : '1px solid #D1D5DB',
                backgroundColor: distMasterStatus === 'approved' ? '#F0FDF4'
                               : distMasterStatus === 'pending'   ? '#FFFBEB'
                               : distMasterStatus === 'rejected'  ? '#FEF2F2'
                               : '#F9F9F9',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: distMasterStatus === 'approved' ? '#166534'
                                   : distMasterStatus === 'pending'   ? '#D97706'
                                   : distMasterStatus === 'rejected'  ? '#DC2626'
                                   : '#9CA3AF'
                  }}>
                    {distMasterStatus === 'approved' ? <Check className="h-5 w-5 text-white" />
                   : distMasterStatus === 'pending'  ? <Clock className="h-5 w-5 text-white" />
                   : distMasterStatus === 'rejected' ? <X className="h-5 w-5 text-white" />
                   : <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>—</span>}
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '15px',
                      color: distMasterStatus === 'approved' ? '#166534'
                           : distMasterStatus === 'pending'   ? '#92400E'
                           : distMasterStatus === 'rejected'  ? '#DC2626'
                           : '#6B7280' }}>
                      Distribution Master ({selectedQuarter} {selectedFY})
                    </p>
                    <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>
                      {selectedQuarter} {selectedFY} — Rate 0.1250
                    </p>
                  </div>
                </div>

                {distMasterStatus === 'approved' ? (
                  <span style={{
                    backgroundColor: '#F0FDF4', color: '#166534',
                    borderRadius: '20px', padding: '6px 14px',
                    fontSize: '13px', fontWeight: '600', border: '1px solid #86EFAC'
                  }}>
                    ✅ Approved & Active
                  </span>
                ) : distMasterStatus === 'pending' ? (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: '#FFFBEB', color: '#92400E',
                      borderRadius: '20px', padding: '6px 14px',
                      fontSize: '13px', fontWeight: '600', border: '1px solid #F59E0B',
                      display: 'block', marginBottom: '8px'
                    }}>
                      ⏳ Pending Approval
                    </span>
                    <a onClick={() => navigate('/admin/approvals')}
                      style={{ color: '#8B1A1A', fontSize: '12px', cursor: 'pointer', fontWeight: '500', textDecoration: 'underline' }}>
                      Go to Approval Queue →
                    </a>
                  </div>
                ) : distMasterStatus === 'rejected' ? (
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      backgroundColor: '#FEF2F2', color: '#DC2626',
                      borderRadius: '20px', padding: '6px 14px',
                      fontSize: '13px', fontWeight: '600', border: '1px solid #FCA5A5',
                      display: 'block', marginBottom: '8px'
                    }}>
                      ❌ Rejected
                    </span>
                    <a onClick={() => navigate('/admin/distribution-master')}
                      style={{ color: '#8B1A1A', fontSize: '12px', cursor: 'pointer', fontWeight: '500', textDecoration: 'underline' }}>
                      Go to Distribution Master →
                    </a>
                  </div>
                ) : (
                  <span style={{
                    backgroundColor: '#F3F4F6', color: '#9CA3AF',
                    borderRadius: '20px', padding: '6px 14px',
                    fontSize: '13px', fontWeight: '600', border: '1px solid #D1D5DB'
                  }}>
                    — Not Submitted
                  </span>
                )}
              </div>
            )}
          </div>

          {/* PROGRESS INDICATOR */}
          <div style={{
            backgroundColor: '#F3F4F6',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginTop: '24px'
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '20px', color: '#8B1A1A' }}>
              {(benposStatus === 'approved' ? 1 : 0) + (distMasterStatus === 'approved' ? 1 : 0)}/2
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', marginBottom: '6px' }}>
                Prerequisites completed
              </p>
              <div style={{ backgroundColor: '#E5E7EB', borderRadius: '99px', height: '6px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  borderRadius: '99px',
                  backgroundColor: '#8B1A1A',
                  width: (benposStatus !== 'approved' && distMasterStatus !== 'approved') ? '0%' : (benposStatus === 'approved' && distMasterStatus === 'approved') ? '100%' : '50%',
                  transition: 'width 0.5s ease'
                }}/>
              </div>
            </div>
            <span style={{ color: '#92400E', fontSize: '13px' }}>
              Pending {2 - ((benposStatus === 'approved' ? 1 : 0) + (distMasterStatus === 'approved' ? 1 : 0))} approval(s)
            </span>
          </div>

          <button disabled style={{
            width: '100%',
            marginTop: '24px',
            backgroundColor: '#E5E7EB',
            color: '#9CA3AF',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <Lock className="h-4 w-4" /> Process Quarter — Awaiting Prerequisites
          </button>
        </div>
      ) : (
        <>
          {/* CASE 3 — BOTH APPROVED Banner */}
          {!isProcessingApproved && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <span style={{ fontSize: '24px' }}>✅</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 'bold', color: '#166534', fontSize: '14px', marginBottom: '2px' }}>
                  All Pre-Requisites Met — Ready to Process
                </p>
                <p style={{ color: '#166534', fontSize: '13px', opacity: 0.8 }}>
                  BENPOS Master ({selectedQuarter}) ✓  •  Distribution Master — Rate 0.1250 ({selectedQuarter}) ✓
                </p>
              </div>
              <span style={{
                backgroundColor: '#166534',
                color: 'white',
                borderRadius: '20px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: '600'
              }}>
                {selectedQuarter} {selectedFY}
              </span>
            </div>
          )}

          {/* Pre-requisite Status Banner */}
          {processState === 'ready' ? (
            <div className="bg-[#FDF0F0] border border-[#D4A0A0] rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-[#8B1A1A] uppercase tracking-wider mb-4">Pre-requisite Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-white">
                  <div className="w-6 h-6 bg-[#8B1A1A] rounded-full flex items-center justify-center text-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">BENPOS Approved</p>
                    <p className="text-[10px] text-slate-500">{selectedQuarter} {selectedFY} (1,102 active)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-white">
                  <div className="w-6 h-6 bg-[#8B1A1A] rounded-full flex items-center justify-center text-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">Dist. Master Approved</p>
                    <p className="text-[10px] text-slate-500">{selectedQuarter} {selectedFY} (Rate: 0.1250)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-xl border border-white">
                  <div className="w-6 h-6 bg-[#8B1A1A] rounded-full flex items-center justify-center text-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1A1A1A]">Ready to Process</p>
                    <p className="text-[10px] text-slate-500">All validations passed</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#FDF0F0] border border-[#D4A0A0] rounded-xl px-6 py-3 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#8B1A1A]" />
              <span className="text-sm font-bold text-[#8B1A1A]">{selectedQuarter} {selectedFY} — All pre-requisites met</span>
            </div>
          )}

          {/* Calculation Logic Card */}
          {showReviewBanner && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3 animate-in fade-in slide-in-from-left-4">
              <Info className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-900 font-bold">Review Mode</p>
                <p className="text-xs text-amber-800">Please review the calculations below and complete the spot check before resubmitting.</p>
              </div>
            </div>
          )}
          <Card className="border-[#D4A0A0] shadow-sm overflow-hidden">
            <div className="p-6 flex items-center justify-between border-b border-gray-100">
              <div>
                <h3 className="font-bold text-lg text-[#8B1A1A]">Calculation Logic</h3>
                <p className="text-gray-500 text-sm">Formula applied for each active investor</p>
              </div>
              <button 
                onClick={() => setShowLogic(!showLogic)}
                className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {showLogic ? '▼ Hide' : '▶ Show'}
              </button>
            </div>

            {showLogic && (
              <div className="p-6 animate-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  {/* Left Column: Formula Steps */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="bg-[#FDF0F0] rounded-xl p-4 border-l-4 border-[#8B1A1A]">
                      <p className="text-[10px] text-[#8B1A1A] font-bold tracking-wider mb-1 uppercase">Step 1</p>
                      <p className="font-mono text-base font-semibold text-[#1A1A1A]">Gross Dividend = Units Held × Unit Rate</p>
                      <p className="text-gray-500 text-xs mt-1 italic">e.g. 1,00,000 × 0.1250 = ₹12,500.00</p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-gray-300 rotate-90" />
                    </div>

                    <div className="bg-[#FDF0F0] rounded-xl p-4 border-l-4 border-[#8B1A1A]">
                      <p className="text-[10px] text-[#8B1A1A] font-bold tracking-wider mb-1 uppercase">Step 2</p>
                      <p className="font-mono text-base font-semibold text-[#1A1A1A]">Rounded up to nearest ₹</p>
                      <p className="text-gray-500 text-xs mt-1 italic">e.g. ₹12,500.40 → ₹12,501</p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-gray-300 rotate-90" />
                    </div>

                    <div className="bg-[#FDF0F0] rounded-xl p-4 border-l-4 border-[#8B1A1A]">
                      <p className="text-[10px] text-[#8B1A1A] font-bold tracking-wider mb-1 uppercase">Step 3</p>
                      <p className="font-mono text-base font-semibold text-[#1A1A1A]">TDS Amount = Gross Dividend × TDS%</p>
                      <p className="text-gray-500 text-xs mt-1 italic">e.g. ₹12,500 × 15% = ₹1,875.00</p>
                      <p className="text-[10px] text-gray-400 mt-2">TDS% sourced from BENPOS master per investor</p>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRight className="h-4 w-4 text-gray-300 rotate-90" />
                    </div>

                    <div className="bg-[#FDF0F0] rounded-xl p-4 border-l-4 border-[#166534]">
                      <p className="text-[10px] text-[#166534] font-bold tracking-wider mb-1 uppercase">Step 4 — FINAL</p>
                      <p className="font-mono text-base font-semibold text-[#166534]">Net Payable = Gross Dividend − TDS Amount</p>
                      <p className="text-[#166534]/70 text-xs mt-1 italic">e.g. ₹12,500 − ₹1,875 = ₹10,625.00</p>
                    </div>
                  </div>

                  {/* Right Column: Live Example */}
                  <div className="lg:col-span-2">
                    <div className="bg-[#FDF0F0] rounded-xl p-5 h-full border border-[#D4A0A0]">
                      <h4 className="font-bold text-[#8B1A1A] mb-1 flex items-center gap-2">
                        <span role="img" aria-label="chart">📊</span> Live Example
                      </h4>
                      <p className="text-gray-500 text-[10px] mb-4">Prasad Agents Pvt Ltd</p>

                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Units Held:</span>
                          <span className="font-bold text-[#1A1A1A]">1,00,000</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">× Unit Rate:</span>
                          <span className="font-bold text-[#1A1A1A]">0.1250</span>
                        </div>
                        <div className="border-b border-dashed border-gray-300 my-2" />
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-semibold">Gross Dividend:</span>
                          <span className="font-bold text-[#1A1A1A]">₹12,500.00</span>
                        </div>
                        <div className="flex justify-between text-[10px]">
                          <span className="text-gray-400 italic">Rounded to ₹:</span>
                          <span className="text-gray-400">₹12,500.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">TDS Rate:</span>
                          <span className="font-bold text-[#1A1A1A]">15%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">− TDS Amount:</span>
                          <span className="font-bold text-red-600">₹1,875.00</span>
                        </div>
                        <div className="border-b border-dashed border-gray-300 my-2" />
                        <div className="flex justify-between items-center pt-1">
                          <span className="text-sm font-bold text-[#166534]">NET PAYABLE:</span>
                          <span className="text-xl font-bold text-[#166534]">₹10,625.00</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-gray-400 mt-6 italic leading-relaxed">
                        Values vary per investor based on their BENPOS data (units & TDS%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data Sources Footer */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <h4 className="font-bold text-[#8B1A1A] text-sm mb-3">Data Sources</h4>
                  <div className="flex flex-wrap gap-4">
                    <div className="bg-[#FDF0F0] rounded-xl px-4 py-3 border border-[#D4A0A0] flex-1 min-w-[200px]">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">📋 Units & TDS%</p>
                      <p className="text-sm font-bold text-[#8B1A1A]">From: BENPOS Master (Approved)</p>
                    </div>
                    <div className="bg-[#FDF0F0] rounded-xl px-4 py-3 border border-[#D4A0A0] flex-1 min-w-[200px]">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">📋 Unit Rate</p>
                      <p className="text-sm font-bold text-[#8B1A1A]">From: Distribution Master (Approved {selectedQuarter})</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {processState === 'ready' && (
            <div className="flex justify-center py-8">
              <Card className="max-w-2xl w-full text-center p-10 border border-gray-200 shadow-sm relative overflow-hidden">
                {isProcessing ? (
                  <div className="flex flex-col items-center py-10">
                    <div className="w-12 h-12 border-4 border-[#8B1A1A]/20 border-t-[#8B1A1A] rounded-full animate-spin mb-4"></div>
                    <p className="text-[#8B1A1A] font-bold">Calculating distribution for 1,102 investors...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#FDF0F0] rounded-full flex items-center justify-center mb-4">
                      <Play className="h-8 w-8 text-[#8B1A1A] fill-[#8B1A1A]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#8B1A1A] mt-4">Ready to Process {selectedQuarter} {selectedFY}</h3>
                    <p className="text-[#1A1A1A] text-sm mt-2">
                      All pre-requisites are met. Click below to calculate distribution for all 1,102 active investors.
                    </p>
                    
                    <div className="w-full grid grid-cols-3 gap-4 bg-[#FDF0F0] rounded-xl p-4 mt-6 border border-[#D4A0A0]">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Active Investors</p>
                        <p className="text-sm font-bold text-[#8B1A1A]">1,102</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Unit Rate</p>
                        <p className="text-sm font-bold text-[#8B1A1A]">0.1250 per unit</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">Quarter</p>
                        <p className="text-sm font-bold text-[#8B1A1A]">{selectedQuarter} {selectedFY}</p>
                      </div>
                    </div>

                    <button 
                      onClick={handleProcess}
                      disabled={isProcessing || processingPending}
                      className="mt-8 px-10 py-4 bg-[#8B1A1A] text-white rounded-xl font-bold text-base hover:bg-[#6B1010] transition-all shadow-lg shadow-[#8B1A1A]/20 flex items-center gap-2 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                        </>
                      ) : processingPending ? (
                        <>🔒 Already Submitted — Awaiting Approval</>
                      ) : (
                        <>
                          <Zap className="h-5 w-5 fill-white" /> Process {selectedQuarter} {selectedFY}
                        </>
                      )}
                    </button>
                    
                    <p className="text-xs text-gray-400 mt-4">
                      This will calculate distribution for all active investors. You can review before submitting for approval.
                    </p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {processState === 'processed' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-[#8B1A1A]">Results Preview</h3>
                  <Button variant="outline" size="sm" className="border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#FDF0F0]">
                    <Download className="h-4 w-4 mr-2" /> Download Report
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#8B1A1A] text-white">
                      <tr>
                        <th className="px-4 py-4 font-semibold">DPCLIENTID</th>
                        <th className="px-4 py-4 font-semibold">Investor Name</th>
                        <th className="px-4 py-4 font-semibold text-right">Units</th>
                        <th className="px-4 py-4 font-semibold text-right">Unit Rate</th>
                        <th className="px-4 py-4 font-semibold text-right">Gross Dividend</th>
                        <th className="px-4 py-4 font-semibold text-right">TDS%</th>
                        <th className="px-4 py-4 font-semibold text-right">TDS Amount</th>
                        <th className="px-4 py-4 font-semibold text-right">Net Payable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((row, i) => (
                        <tr key={i} className={cn(i % 2 !== 0 ? "bg-[#FDF0F0]" : "bg-white")}>
                          <td className="px-4 py-3 font-bold text-slate-900">{row.id}</td>
                          <td className="px-4 py-3 text-slate-600">{row.name}</td>
                          <td className="px-4 py-3 text-right font-medium">{row.units.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{row.rate.toFixed(4)}</td>
                          <td className="px-4 py-3 text-right font-bold text-slate-900">₹{row.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right">{row.tdsRate}%</td>
                          <td className="px-4 py-3 text-right text-red-600 font-medium">₹{row.tdsAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3 text-right font-bold text-[#8B1A1A]">₹{row.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                      <tr className="bg-[#8B1A1A] text-white font-bold">
                        <td colSpan={2} className="px-4 py-4 text-right uppercase tracking-wider text-xs">Total Distribution</td>
                        <td className="px-4 py-4 text-right">{totals.units.toLocaleString()}</td>
                        <td className="px-4 py-4"></td>
                        <td className="px-4 py-4 text-right">₹{totals.gross.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-4"></td>
                        <td className="px-4 py-4 text-right">₹{totals.tdsAmt.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="px-4 py-4 text-right">₹{totals.net.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {showReviewBanner && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                  <h4 className="text-[#8B1A1A] font-bold mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Spot Check Checklist
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: 'count', label: 'Confirmed total investor count matches BENPOS' },
                      { id: 'rate', label: 'Verified Unit Rate matches approved Master' },
                      { id: 'tds', label: 'Cross-checked TDS rates with Master data' },
                      { id: 'totals', label: 'Validated Net Payable rounding logic' }
                    ].map((item) => (
                      <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={checks[item.id as keyof typeof checks]}
                          onChange={(e) => setChecks(prev => ({ ...prev, [item.id]: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]"
                        />
                        <span className="text-sm text-slate-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <Badge variant="success" className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    Processing Complete — Pending Approval
                  </Badge>
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-[10px] font-medium">Once approved, this quarter will be permanently locked.</span>
                  </div>
                </div>
                {processingPending ? (
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
                        This Distribution Processing for {selectedQuarter} {selectedFY} is 
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
                      View in Approval Queue →
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleSubmitClick}
                    disabled={showReviewBanner && !Object.values(checks).every(Boolean)}
                    className={cn(
                      "px-8 py-3 rounded-xl font-bold transition-all shadow-lg",
                      showReviewBanner && !Object.values(checks).every(Boolean)
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                        : "bg-[#8B1A1A] text-white hover:bg-[#6B1010] shadow-[#8B1A1A]/20"
                    )}
                  >
                    {showReviewBanner ? 'Resubmit for Approval →' : 'Submit for Approval'}
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto pt-32 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FDF0F0] rounded-full flex items-center justify-center mb-4">
                <Send className="h-8 w-8 text-[#8B1A1A]" />
              </div>
              <h3 className="text-xl font-bold text-[#8B1A1A] mb-2">Submit Processing for Approval?</h3>
              <p className="text-[#1A1A1A] text-sm">The results will be sent to the Approver for final review.</p>
              
              <div className="w-full bg-[#FDF0F0] rounded-lg p-4 mt-4 text-left space-y-2 border border-[#D4A0A0]">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Quarter:</span>
                  <span className="font-bold text-[#8B1A1A]">{selectedQuarter} {selectedFY}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Investors:</span>
                  <span className="font-bold text-[#8B1A1A]">1,102</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Gross:</span>
                  <span className="font-bold text-[#8B1A1A]">₹49,437.50</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total TDS:</span>
                  <span className="font-bold text-[#8B1A1A]">₹8,068.75</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Total Net Payable:</span>
                  <span className="font-bold text-[#8B1A1A]">₹41,368.75</span>
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
                <AlertTriangle className="h-3 w-3" /> Once approved, {selectedQuarter} {selectedFY} will be permanently locked. No edits or reprocessing allowed.
              </p>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <button 
                  onClick={() => setShowModal(false)}
                  className="border border-gray-300 text-gray-600 rounded-lg px-6 py-3 font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmSubmit}
                  className="bg-[#8B1A1A] text-white rounded-lg px-6 py-3 font-bold hover:bg-[#6B1010] transition-colors"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Detail Modal */}
      {showRejectionDetailModal && processingRejection && (
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
              <p className="text-red-700 text-sm">Distribution Processing — {selectedQuarter} {selectedFY}</p>
            </div>

            <div className="space-y-4">
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Reason for Rejection</p>
                <p className="text-red-900 font-semibold">{processingRejection.reason}</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Approver's Comments</p>
                <p className="text-slate-700 italic">"{processingRejection.comment}"</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <p>Rejected by: Rahul Sharma</p>
                <p>{processingRejection.rejectedAt}</p>
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
