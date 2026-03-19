import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Check, 
  X, 
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Info
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { cn } from '../../lib/utils';
import { useApprovals } from '../../context/ApprovalContext';

export const ApprovalQueue = () => {
  // ✅ STEP 1 — Context hook (always first)
  const approvals = useApprovals();
  const { pendingApprovals = [], approveItem, rejectItem } = approvals || {};

  // ✅ STEP 2 — ALL useState BEFORE any returns
  const [activeTab, setActiveTab] = useState('pending');
  const [completedItems, setCompletedItems] = useState([
    { type: 'Distribution Processing', quarter: 'Q2 FY 2025-26', submittedBy: 'Rahul Sharma', reviewedBy: 'Ashish Ranjan', date: '03 Oct 2025', status: 'Approved' },
    { type: 'Distribution Master', quarter: 'Q2 FY 2025-26', submittedBy: 'Rahul Sharma', reviewedBy: 'Ashish Ranjan', date: '02 Oct 2025', status: 'Approved' },
    { type: 'BENPOS Upload', quarter: 'Q2 FY 2025-26', submittedBy: 'Rahul Sharma', reviewedBy: 'Ashish Ranjan', date: '02 Oct 2025', status: 'Approved' },
    { type: 'BENPOS Upload', quarter: 'Q1 FY 2025-26', submittedBy: 'Rahul Sharma', reviewedBy: 'Ashish Ranjan', date: '03 Jul 2025', status: 'Rejected' },
    { type: 'Distribution Processing', quarter: 'Q4 FY 2024-25', submittedBy: 'Priya Mehta', reviewedBy: 'Ashish Ranjan', date: '06 Apr 2025', status: 'Approved' },
  ]);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [approverNote, setApproverNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [toast, setToast] = useState<{ type: 'success' | 'reject', title: string, message: string } | null>(null);
  const [completedFilter, setCompletedFilter] = useState('All');
  const [checklist, setChecklist] = useState({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
    item5: false
  });

  // ✅ STEP 3 — useEffect AFTER useState
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // ✅ STEP 4 — Derived values (not hooks)
  const selectedCardData = selectedCard ? pendingApprovals.find(i => i.id === selectedCard) : null;
  const completedCardData = selectedCard ? completedItems.find(i => {
    const typeId = i.type.toLowerCase().replace(/\s+/g, '-');
    // Match exact typeId or typeId followed by a hyphen (for quarter-aware IDs)
    return selectedCard === typeId || selectedCard.startsWith(typeId + '-');
  }) : null;

  // ✅ STEP 5 — NOW safe to do early return
  // (after ALL hooks have been called)
  if (!approvals || !pendingApprovals) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
        Loading approval queue...
      </div>
    );
  }

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  console.log('approveItem:', approveItem);
  console.log('pendingApprovals:', pendingApprovals);
  console.log('selectedCard:', selectedCard);

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
            <h1 style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '24px' }}>Approval Queue</h1>
            <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '20px', padding: '2px 12px', fontSize: '13px', fontWeight: '600' }}>
              {pendingApprovals.length} Pending
            </span>
          </div>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>Review and approve pending submissions</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', marginBottom: '24px' }}>
        <div 
          onClick={() => setActiveTab('pending')}
          style={{
            borderBottom: activeTab === 'pending' ? '3px solid #8B1A1A' : 'none',
            color: activeTab === 'pending' ? '#8B1A1A' : '#6B7280',
            fontWeight: activeTab === 'pending' ? '600' : '400',
            padding: '12px 20px',
            cursor: 'pointer'
          }}
        >
          Pending ({pendingApprovals.length})
        </div>
        <div 
          onClick={() => setActiveTab('completed')}
          style={{
            borderBottom: activeTab === 'completed' ? '3px solid #8B1A1A' : 'none',
            color: activeTab === 'completed' ? '#8B1A1A' : '#6B7280',
            fontWeight: activeTab === 'completed' ? '600' : '400',
            padding: '12px 20px',
            cursor: 'pointer'
          }}
        >
          Completed
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' ? (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
              <p style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '18px' }}>All caught up!</p>
              <p style={{ color: '#6B7280', marginTop: '8px' }}>No pending approvals at this time.</p>
            </div>
          ) : (
            pendingApprovals.map(data => {
              return (
                <div key={data.id} style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #E5E7EB', borderLeft: '4px solid #8B1A1A', padding: '24px', marginBottom: '16px' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <span style={{ backgroundColor: '#FDF0F0', color: '#8B1A1A', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        {data.type}
                      </span>
                      <h3 style={{ fontWeight: 'bold', fontSize: '17px', color: '#1A1A1A', marginTop: '8px' }}>{data.title}</h3>
                      <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>Submitted by Ashish Ranjan • {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '500' }}>
                      ⏱ {data.timer}
                    </span>
                  </div>

                  <div style={{ backgroundColor: '#FDF0F0', borderRadius: '12px', padding: '16px', marginTop: '16px', display: 'grid', gridTemplateColumns: `repeat(${data.gridCols || data.stats.length}, 1fr)`, gap: '12px' }}>
                    {data.stats.map((stat, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{stat.label}</p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => { setSelectedCard(data.id); setShowDetailModal(true); setChecklist({ item1: false, item2: false, item3: false, item4: false, item5: false }); }}
                      style={{ border: '1px solid #D1D5DB', color: '#374151', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCard(data.id);
                        setShowApproveModal(true);
                      }}
                      style={{ backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                    >
                      ✓ Approve
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCard(data.id);
                        setShowRejectModal(true);
                      }}
                      style={{ border: '1px solid #FCA5A5', color: '#DC2626', backgroundColor: 'white', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer' }}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div>
          {/* Completed Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-[#8B1A1A] shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Total Completed</p>
              <p className="text-2xl font-bold text-[#1A1A1A]">{completedItems.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-[#166534] shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Approved</p>
              <p className="text-2xl font-bold text-[#166534]">{completedItems.filter(i => i.status === 'Approved').length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 border-l-4 border-l-[#DC2626] shadow-sm">
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Rejected</p>
              <p className="text-2xl font-bold text-[#DC2626]">{completedItems.filter(i => i.status === 'Rejected').length}</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-4">
            {['All', 'Approved', 'Rejected'].map(filter => (
              <button
                key={filter}
                onClick={() => setCompletedFilter(filter)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                  completedFilter === filter 
                    ? "bg-[#8B1A1A] text-white" 
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[#8B1A1A]"
                )}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Completed Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#8B1A1A] text-white">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Quarter</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Submitted By</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Reviewed By</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {completedItems
                  .filter(i => completedFilter === 'All' || i.status === completedFilter)
                  .map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#FDF0F0]/30"}>
                    <td className="px-4 py-3 text-sm font-medium text-[#1A1A1A]">{item.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.quarter}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.submittedBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.reviewedBy}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.date}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        item.status === 'Approved' ? "bg-[#F0FDF4] text-[#166534]" : "bg-[#FEF2F2] text-[#DC2626]"
                      )}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => { 
                          const typeId = item.type.toLowerCase().replace(/\s+/g, '-');
                          setSelectedCard(typeId); 
                          setShowDetailModal(true); 
                        }}
                        className="text-[#8B1A1A] text-sm font-bold hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10">
          <div className="bg-white rounded-2xl max-w-[680px] w-[90%] p-8 relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex justify-between items-start mb-6">
              <div>
                <span style={{ backgroundColor: '#FDF0F0', color: '#8B1A1A', borderRadius: '20px', padding: '3px 12px', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {activeTab === 'pending' ? selectedCardData?.type : (completedCardData?.type || selectedCard?.toUpperCase()?.replace(/-/g, ' '))}
                </span>
                <h2 className="text-xl font-bold text-[#1A1A1A] mt-2">
                  {activeTab === 'pending' ? selectedCardData?.title : (completedCardData ? `${completedCardData.type} — ${completedCardData.quarter}` : (selectedCard?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' — Q3 FY 2025-26'))}
                </h2>
              </div>
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold",
                activeTab === 'pending' ? "bg-amber-100 text-amber-700" : (completedCardData?.status === 'Approved' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700")
              )}>
                {activeTab === 'pending' ? 'Pending Approval' : `Completed — ${completedCardData?.status || 'Unknown'}`}
              </span>
            </div>

            {/* Modal Content based on selectedCard */}
            {(selectedCard?.startsWith('benpos')) && (
              <div className="space-y-6">
                <div style={{ backgroundColor: '#FDF0F0', borderRadius: '12px', padding: '20px' }}>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div><p className="text-gray-500">Quarter:</p><p className="font-bold">Q3 FY 2025-26</p></div>
                    <div><p className="text-gray-500">Uploaded By:</p><p className="font-bold">Rahul Sharma</p></div>
                    <div><p className="text-gray-500">Upload Time:</p><p className="font-bold">28 Feb 2026, 10:32 AM</p></div>
                    <div><p className="text-gray-500">Total in File:</p><p className="font-bold">1,108 records</p></div>
                    <div><p className="text-gray-500">New Records:</p><p className="font-bold text-[#8B1A1A]">48</p></div>
                    <div><p className="text-gray-500">Active after upload:</p><p className="font-bold">1,105</p></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#8B1A1A] mb-2">Rejected Records (3)</h4>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#8B1A1A] text-white">
                        <tr>
                          <th className="px-3 py-2">DPCLIENTID</th>
                          <th className="px-3 py-2">Investor Name</th>
                          <th className="px-3 py-2">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="px-3 py-2">DPCL00234</td>
                          <td className="px-3 py-2">Kapoor Investments</td>
                          <td className="px-3 py-2 text-red-500">Missing TDS%</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="px-3 py-2">DPCL00891</td>
                          <td className="px-3 py-2">Mehta Securities</td>
                          <td className="px-3 py-2 text-red-500">Duplicate DPCLIENTID</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2">DPCL01102</td>
                          <td className="px-3 py-2">Singh & Associates</td>
                          <td className="px-3 py-2 text-red-500">Invalid PAN format</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#8B1A1A] mb-2">Approval Checklist</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'item1', label: 'File format and structure validated' },
                      { id: 'item2', label: 'Duplicate records reviewed and excluded' },
                      { id: 'item3', label: 'Mandatory fields verified' },
                      { id: 'item4', label: 'Record counts match expected range' }
                    ].map(item => (
                      <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={checklist[item.id as keyof typeof checklist]} 
                          onChange={() => toggleCheck(item.id as keyof typeof checklist)}
                          className="rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]" 
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedCard?.startsWith('distribution-master') && (
              <div className="space-y-6">
                <div style={{ backgroundColor: '#FDF0F0', borderRadius: '12px', padding: '20px' }}>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div><p className="text-gray-500">Financial Year:</p><p className="font-bold">FY 2025-26</p></div>
                    <div><p className="text-gray-500">Quarter:</p><p className="font-bold">Q3</p></div>
                    <div><p className="text-gray-500">Unit Rate:</p><p className="font-bold text-[#8B1A1A]">0.1250 per unit</p></div>
                    <div><p className="text-gray-500">Submitted By:</p><p className="font-bold">Rahul Sharma</p></div>
                    <div><p className="text-gray-500">Submitted On:</p><p className="font-bold">28 Feb 2026, 11:15 AM</p></div>
                    <div><p className="text-gray-500">Status:</p><p className="font-bold text-amber-600">Pending Approval</p></div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#8B1A1A] mb-2">Approval Checklist</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'item1', label: 'Rate confirmed with finance team' },
                      { id: 'item2', label: 'Quarter selection is correct' },
                      { id: 'item3', label: 'Rate format (4 decimal places) verified' },
                      { id: 'item4', label: 'No duplicate entry for this quarter' }
                    ].map(item => (
                      <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={checklist[item.id as keyof typeof checklist]} 
                          onChange={() => toggleCheck(item.id as keyof typeof checklist)}
                          className="rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]" 
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedCard?.startsWith('distribution-processing') && (
              <div className="space-y-6">
                <div style={{ backgroundColor: '#FDF0F0', borderRadius: '12px', padding: '20px' }}>
                  <div className="grid grid-cols-2 gap-y-4 text-sm">
                    <div><p className="text-gray-500">Quarter:</p><p className="font-bold">Q3 FY 2025-26</p></div>
                    <div><p className="text-gray-500">Processed By:</p><p className="font-bold">Rahul Sharma</p></div>
                    <div><p className="text-gray-500">Processed On:</p><p className="font-bold">28 Feb 2026, 02:45 PM</p></div>
                    <div><p className="text-gray-500">Total Investors:</p><p className="font-bold">1,102</p></div>
                    <div><p className="text-gray-500">Unit Rate Used:</p><p className="font-bold">0.1250</p></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Gross', value: '₹49,437.50', color: '#8B1A1A' },
                    { label: 'Total TDS', value: '₹8,068.75', color: '#DC2626' },
                    { label: 'Net Payable', value: '₹41,368.75', color: '#166534' },
                    { label: 'Avg per Investor', value: '₹37.54', color: '#1A1A1A' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-gray-200 rounded-xl p-3 text-center">
                      <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">{stat.label}</p>
                      <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-[#8B1A1A] text-white">
                        <tr>
                          <th className="px-2 py-2">DPCLIENTID</th>
                          <th className="px-2 py-2">Name</th>
                          <th className="px-2 py-2">Units</th>
                          <th className="px-2 py-2">Gross</th>
                          <th className="px-2 py-2">TDS</th>
                          <th className="px-2 py-2">Net</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: 'DPCL00101', name: 'Rajesh Kumar Iyer', units: '5,000', gross: '₹625', tds: '₹62.50', net: '₹562.50' },
                          { id: 'DPCL00102', name: 'Priya Sharma', units: '12,000', gross: '₹1,500', tds: '₹150', net: '₹1,350' },
                          { id: 'DPCL00103', name: 'Krishnamurthy Ventures', units: '2,50,000', gross: '₹31,250', tds: '₹6,250', net: '₹25,000' },
                          { id: 'DPCL00104', name: 'Sunita Deshmukh', units: '8,500', gross: '₹1,062.50', tds: '₹106.25', net: '₹956.25' },
                          { id: 'DPCL00105', name: 'Vikram Singh Rathore', units: '15,000', gross: '₹1,875', tds: '₹187.50', net: '₹1,687.50' }
                        ].map((row, i) => (
                          <tr key={i} className="border-b border-gray-100">
                            <td className="px-2 py-2 font-medium">{row.id}</td>
                            <td className="px-2 py-2">{row.name}</td>
                            <td className="px-2 py-2">{row.units}</td>
                            <td className="px-2 py-2">{row.gross}</td>
                            <td className="px-2 py-2">{row.tds}</td>
                            <td className="px-2 py-2 font-bold">{row.net}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="text-center text-gray-400 text-xs py-2 bg-gray-50">...and 1,097 more investors</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-[#8B1A1A] mb-2">Approval Checklist</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'item1', label: 'Total investor count verified (1,102)' },
                      { id: 'item2', label: 'Unit rate matches approved master (0.1250)' },
                      { id: 'item3', label: 'TDS calculations spot-checked' },
                      { id: 'item4', label: 'Net payable totals verified' },
                      { id: 'item5', label: 'Rounding rules applied correctly' }
                    ].map(item => (
                      <label key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={checklist[item.id as keyof typeof checklist]} 
                          onChange={() => toggleCheck(item.id as keyof typeof checklist)}
                          className="rounded border-gray-300 text-[#8B1A1A] focus:ring-[#8B1A1A]" 
                        />
                        <span className="text-sm text-gray-700">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="mt-8 p-4 bg-[#FDF0F0] rounded-xl border border-[#D4A0A0]">
                <h4 className="font-bold text-[#8B1A1A] mb-3">Review Notes</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Reviewed by:</span> <span className="font-bold">Ashish Ranjan</span></p>
                  <p>
                    <span className="text-gray-500">Decision:</span> 
                    <span className={cn(
                      "font-bold ml-1",
                      completedCardData?.status === 'Approved' ? "text-[#166534]" : "text-[#DC2626]"
                    )}>
                      {completedCardData?.status}
                    </span>
                  </p>
                  <p><span className="text-gray-500">Note:</span> <span className="italic">"Verified and approved for Q3 processing"</span></p>
                  <p><span className="text-gray-500">Date:</span> <span className="font-bold">{completedCardData?.date || '01 Mar 2026'}</span></p>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            {activeTab === 'pending' ? (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-6 mt-8 flex justify-end gap-3">
                <button
                  onClick={() => { setShowDetailModal(false); setShowRejectModal(true); }}
                  style={{ border: '1px solid #FCA5A5', color: '#DC2626', backgroundColor: 'white', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  ✗ Reject
                </button>
                <button
                  onClick={() => { setShowDetailModal(false); setShowApproveModal(true); }}
                  style={{ backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  ✓ Approve
                </button>
              </div>
            ) : (
              <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-6 mt-8 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  style={{ border: '1px solid #D1D5DB', color: '#374151', backgroundColor: 'white', borderRadius: '8px', padding: '10px 24px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Approve Confirmation Modal */}
      {showApproveModal && selectedCard && selectedCardData && (
        <div 
          onClick={() => setShowApproveModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              maxWidth: '440px',
              width: '100%',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1A1A1A' }}>Confirm Approval</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>You are about to approve:</p>
            
            {/* Summary Pills */}
            <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
              <span style={{ backgroundColor: '#FDF0F0', color: '#8B1A1A', borderRadius: '9999px', padding: '4px 12px', fontSize: '12px', fontWeight: '600', border: '1px solid #D4A0A0' }}>
                {selectedCardData.type}
              </span>
              <span style={{ backgroundColor: '#FDF0F0', color: '#8B1A1A', borderRadius: '9999px', padding: '4px 12px', fontSize: '12px', fontWeight: '600', border: '1px solid #D4A0A0' }}>
                {selectedCardData.quarter} {selectedCardData.fy}
              </span>
            </div>

            <div style={{ marginTop: '20px', backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '12px', padding: '12px', textAlign: 'left' }}>
              <p style={{ fontSize: '12px', color: '#92400E', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={14} /> This action cannot be undone.
              </p>
              <p style={{ fontSize: '12px', color: '#92400E', marginTop: '4px' }}>Once approved, this record will be locked and moved to completed.</p>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>Add a note (optional)</label>
              <textarea
                value={approverNote}
                onChange={(e) => setApproverNote(e.target.value)}
                rows={3}
                placeholder="e.g. Verified and approved for Q3 processing"
                style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '12px', padding: '12px', fontSize: '13px', outline: 'none', resize: 'none' }}
              />
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowApproveModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', color: '#374151', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', backgroundColor: 'white' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  try {
                    if (!selectedCard || !selectedCardData) {
                      console.error('No card selected for approval');
                      return;
                    }

                    // Capture snapshot BEFORE any state changes
                    const cardSnapshot = { ...selectedCardData };
                    const cardId = selectedCard;

                    // 1. Close modal + reset FIRST (before context state changes)
                    setShowApproveModal(false);
                    setSelectedCard(null);
                    setApproverNote('');

                    // 2. Call context approveItem
                    approveItem(cardId, cardSnapshot);

                    // 3. Add to completed items list
                    setCompletedItems(prev => {
                      const newItem = {
                        type: cardSnapshot.type || 'Unknown',
                        quarter: `${cardSnapshot.quarter || 'Q?'} ${cardSnapshot.fy || 'FY?'}`,
                        submittedBy: cardSnapshot.submittedBy || 'Rahul Sharma',
                        reviewedBy: 'Ashish Ranjan',
                        date: new Date().toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }),
                        status: 'Approved',
                        note: approverNote || 'Approved.'
                      };
                      return [...prev, newItem];
                    });

                    // 4. Toast
                    setTimeout(() => {
                      setToast({
                        type: 'success',
                        title: '✅ Approved',
                        message: `${cardSnapshot.type || 'Item'} approved successfully.`
                      });
                    }, 100);
                  } catch (err) {
                    console.error('Crash in handleConfirmApproval:', err);
                    setShowApproveModal(false);
                    setSelectedCard(null);
                  }
                }}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', backgroundColor: '#166534', color: 'white', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer' }}
              >
                Confirm Approval ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedCard && selectedCardData && (
        <div 
          onClick={() => setShowRejectModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              borderRadius: '24px',
              maxWidth: '440px',
              width: '100%',
              padding: '32px',
              textAlign: 'center',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#DC2626' }}>Reject Submission?</h3>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>Provide a reason — the maker will be notified.</p>

            <div style={{ marginTop: '20px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>Reason for Rejection</label>
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '12px', padding: '12px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }}
              >
                <option value="">-- Select a reason --</option>
                <option>Data inconsistency found</option>
                <option>Incorrect unit rate</option>
                <option>Missing mandatory records</option>
                <option>Calculation error detected</option>
                <option>Record count mismatch</option>
                <option>Other (specify below)</option>
              </select>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>Additional Comments (required)</label>
              <textarea
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                rows={3}
                placeholder="Provide specific details..."
                style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '12px', padding: '12px', fontSize: '13px', outline: 'none', resize: 'none' }}
              />
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowRejectModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #D1D5DB', color: '#374151', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', backgroundColor: 'white' }}
              >
                Cancel
              </button>
              <button
                disabled={!rejectReason || !rejectComment}
                onClick={() => {
                  try {
                    if (!rejectReason || !rejectComment || !selectedCard || !selectedCardData) {
                      console.error('Missing rejection data');
                      return;
                    }

                    // Capture snapshot BEFORE any state changes
                    const cardSnapshot = { ...selectedCardData };
                    const cardId = selectedCard;
                    const reason = rejectReason;
                    const comment = rejectComment;

                    // 1. Close modal + reset FIRST
                    setShowRejectModal(false);
                    setSelectedCard(null);
                    setRejectReason('');
                    setRejectComment('');

                    // 2. Call context rejectItem
                    rejectItem(cardId, cardSnapshot, reason, comment);

                    // 3. Add to completed items list
                    setCompletedItems(prev => {
                      const newItem = {
                        type: cardSnapshot.type || 'Unknown',
                        quarter: `${cardSnapshot.quarter || 'Q?'} ${cardSnapshot.fy || 'FY?'}`,
                        submittedBy: cardSnapshot.submittedBy || 'Rahul Sharma',
                        reviewedBy: 'Ashish Ranjan',
                        date: new Date().toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        }),
                        status: 'Rejected',
                        reason,
                        comment
                      };
                      return [...prev, newItem];
                    });

                    // 4. Toast
                    setTimeout(() => {
                      setToast({
                        type: 'reject',
                        title: '❌ Rejected',
                        message: `${cardSnapshot.type || 'Item'} rejected. Maker notified.`
                      });
                    }, 100);
                  } catch (err) {
                    console.error('Crash in handleConfirmRejection:', err);
                    setShowRejectModal(false);
                    setSelectedCard(null);
                  }
                }}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '12px', 
                  backgroundColor: (!rejectReason || !rejectComment) ? '#E5E7EB' : '#DC2626', 
                  color: (!rejectReason || !rejectComment) ? '#9CA3AF' : 'white', 
                  fontWeight: 'bold', 
                  fontSize: '14px', 
                  border: 'none', 
                  cursor: (!rejectReason || !rejectComment) ? 'not-allowed' : 'pointer' 
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{ position: 'fixed', top: '16px', right: '16px', zIndex: 100, backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: '16px 20px', minWidth: '300px', borderLeft: toast.type === 'success' ? '4px solid #166534' : '4px solid #DC2626', animation: 'slideIn 0.3s ease' }}>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-[#1A1A1A]">{toast.title}</p>
              <p className="text-[#6B7280] text-[13px] mt-1">{toast.message}</p>
            </div>
            <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
    );
};
