import React, { useState, useEffect } from 'react';
import { BarChart2, Search, Download, FileText, User, Calendar, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Reports = () => {
  // STATE VARIABLES
  const [activeTab, setActiveTab] = useState('benpos');
  const [benposSearch, setBenposSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [qwFY, setQwFY] = useState('FY 2025-26');
  const [qwQuarter, setQwQuarter] = useState('Q3');
  const [qwGenerated, setQwGenerated] = useState(false);
  const [iwInput, setIwInput] = useState('');
  const [iwSearched, setIwSearched] = useState(false);
  const [exportToast, setExportToast] = useState(false);

  // EXPORT TOAST LOGIC
  useEffect(() => {
    if (exportToast) {
      const t = setTimeout(() => setExportToast(false), 1500);
      return () => clearTimeout(t);
    }
  }, [exportToast]);

  const handleExport = () => setExportToast(true);

  // TAB 1 DATA
  const benposData = [
    { dpId: 'DPCL00101', pan: 'ABCDE1234F', name: 'Rajesh Kumar Iyer', category: 'NRI', units: 5000, tds: '10%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00102', pan: 'BCDFE2345G', name: 'Priya Sharma', category: 'Resident', units: 12000, tds: '10%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00103', pan: 'CDEFG3456H', name: 'Krishnamurthy Ventures Pvt Ltd', category: 'Mutual Fund', units: 250000, tds: '20%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00104', pan: 'DEFGH4567I', name: 'Sunita Deshmukh', category: 'NRI', units: 8500, tds: '10%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00105', pan: 'EFGHI5678J', name: 'Vikram Singh Rathore', category: 'Resident', units: 15000, tds: '10%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00106', pan: 'FGHIJ6789K', name: 'Ananya Investments Pvt Ltd', category: 'Mutual Fund', units: 42000, tds: '10%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00107', pan: 'GHIJK7890L', name: 'Mohammad Azharuddin Enterprises', category: 'NRI', units: 60000, tds: '10%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00108', pan: 'HIJKL8901M', name: 'Kavita Krishnamurthy Holdings', category: 'Resident', units: 3000, tds: '10%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00109', pan: 'IJKLM9012N', name: 'Prasad Agents Pvt Ltd', category: 'PF Trust', units: 100000, tds: '15%', status: 'Active', date: '15 Jan 2026' },
    { dpId: 'DPCL00110', pan: 'JKLMN0123O', name: 'Northern Star Insurance Co', category: 'Insurance', units: 75000, tds: '10%', status: 'Inactive', date: '01 Oct 2025' },
  ];

  const filteredBenpos = benposData.filter(row => {
    const matchesSearch = row.name.toLowerCase().includes(benposSearch.toLowerCase()) || 
                          row.pan.toLowerCase().includes(benposSearch.toLowerCase());
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || row.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // TAB 2 DATA
  const masterData = [
    { fy: 'FY 2025-26', q: 'Q3', rate: '0.1250', trend: 'down', createdBy: 'Rahul Sharma', createdOn: '28 Feb 2026', approvedBy: '—', approvedOn: '—', status: 'Pending Approval' },
    { fy: 'FY 2025-26', q: 'Q2', rate: '0.1300', trend: 'up', createdBy: 'Rahul Sharma', createdOn: '01 Jul 2025', approvedBy: 'Ashish Ranjan', approvedOn: '02 Jul 2025', status: 'Approved' },
    { fy: 'FY 2025-26', q: 'Q1', rate: '0.1250', trend: 'up', createdBy: 'Rahul Sharma', createdOn: '01 Apr 2025', approvedBy: 'Ashish Ranjan', approvedOn: '02 Apr 2025', status: 'Approved' },
    { fy: 'FY 2024-25', q: 'Q4', rate: '0.1200', trend: 'equal', createdBy: 'Rahul Sharma', createdOn: '02 Jan 2025', approvedBy: 'Ashish Ranjan', approvedOn: '03 Jan 2025', status: 'Approved' },
    { fy: 'FY 2024-25', q: 'Q3', rate: '0.1200', trend: 'equal', createdBy: 'Rahul Sharma', createdOn: '01 Oct 2024', approvedBy: 'Ashish Ranjan', approvedOn: '02 Oct 2024', status: 'Approved' },
    { fy: 'FY 2024-25', q: 'Q2', rate: '0.1150', trend: 'up', createdBy: 'Rahul Sharma', createdOn: '01 Jul 2024', approvedBy: 'Ashish Ranjan', approvedOn: '02 Jul 2024', status: 'Approved' },
  ];

  // TAB 3 DATA
  const qwData = [
    { id: 'DPCL00101', name: 'Rajesh Kumar Iyer', units: '5,000', rate: '0.1250', gross: '₹625.00', tds: '10%', tdsAmt: '₹62.50', net: '₹562.50' },
    { id: 'DPCL00102', name: 'Priya Sharma', units: '12,000', rate: '0.1250', gross: '₹1,500.00', tds: '10%', tdsAmt: '₹150.00', net: '₹1,350.00' },
    { id: 'DPCL00103', name: 'Krishnamurthy Ventures Pvt Ltd', units: '2,50,000', rate: '0.1250', gross: '₹31,250.00', tds: '20%', tdsAmt: '₹6,250.00', net: '₹25,000.00' },
    { id: 'DPCL00104', name: 'Sunita Deshmukh', units: '8,500', rate: '0.1250', gross: '₹1,062.50', tds: '10%', tdsAmt: '₹106.25', net: '₹956.25' },
    { id: 'DPCL00105', name: 'Vikram Singh Rathore', units: '15,000', rate: '0.1250', gross: '₹1,875.00', tds: '10%', tdsAmt: '₹187.50', net: '₹1,687.50' },
    { id: 'DPCL00106', name: 'Ananya Investments Pvt Ltd', units: '42,000', rate: '0.1250', gross: '₹5,250.00', tds: '10%', tdsAmt: '₹525.00', net: '₹4,725.00' },
    { id: 'DPCL00107', name: 'Mohammad Azharuddin Enterprises', units: '60,000', rate: '0.1250', gross: '₹7,500.00', tds: '10%', tdsAmt: '₹750.00', net: '₹6,750.00' },
    { id: 'DPCL00108', name: 'Kavita Krishnamurthy Holdings', units: '3,000', rate: '0.1250', gross: '₹375.00', tds: '10%', tdsAmt: '₹37.50', net: '₹337.50' },
  ];

  // TAB 4 DATA
  const iwHistory = [
    { fy: 'FY 2025-26', q: 'Q3', units: '1,00,000', rate: '0.1250', gross: '₹12,500.00', tds: '15%', tdsAmt: '₹1,875.00', net: '₹10,625.00', status: 'Pending Approval' },
    { fy: 'FY 2025-26', q: 'Q2', units: '1,00,000', rate: '0.1300', gross: '₹13,000.00', tds: '15%', tdsAmt: '₹1,950.00', net: '₹11,050.00', status: 'Approved' },
    { fy: 'FY 2025-26', q: 'Q1', units: '1,00,000', rate: '0.1250', gross: '₹12,500.00', tds: '15%', tdsAmt: '₹1,875.00', net: '₹10,625.00', status: 'Approved' },
    { fy: 'FY 2024-25', q: 'Q4', units: '95,000', rate: '0.1200', gross: '₹11,400.00', tds: '15%', tdsAmt: '₹1,710.00', net: '₹9,690.00', status: 'Approved' },
    { fy: 'FY 2024-25', q: 'Q3', units: '95,000', rate: '0.1200', gross: '₹11,400.00', tds: '15%', tdsAmt: '₹1,710.00', net: '₹9,690.00', status: 'Approved' },
    { fy: 'FY 2024-25', q: 'Q2', units: '90,000', rate: '0.1150', gross: '₹10,350.00', tds: '15%', tdsAmt: '₹1,552.50', net: '₹8,797.50', status: 'Approved' },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* PAGE HEADER */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px' }}>
          Reports
        </h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          View and export quarterly distribution reports
        </p>
      </div>

      {/* TABS */}
      <div style={{ borderBottom: '2px solid #E5E7EB', display: 'flex', marginBottom: '24px' }}>
        {[
          { id: 'benpos', label: 'BENPOS Master Report' },
          { id: 'master', label: 'Distribution Master Report' },
          { id: 'quarter', label: 'Quarter-wise Distribution' },
          { id: 'investor', label: 'Investor-wise Report' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              fontSize: '14px',
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '3px solid #8B1A1A' : 'none',
              marginBottom: activeTab === tab.id ? '-2px' : '0',
              color: activeTab === tab.id ? '#8B1A1A' : '#6B7280',
              fontWeight: activeTab === tab.id ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* EXPORT TOAST */}
      {exportToast && (
        <div style={{
          position: 'fixed', top: '16px', right: '16px',
          zIndex: 100, backgroundColor: 'white',
          borderRadius: '10px', padding: '12px 20px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderLeft: '4px solid #166534',
          display: 'flex', alignItems: 'center', gap: '8px',
          animation: 'slideIn 0.3s ease'
        }}>
          ✅ <span style={{ fontWeight: '600', fontSize: '14px' }}>Exporting...</span>
          <span style={{ color: '#6B7280', fontSize: '13px' }}>
            Your file will download shortly.
          </span>
        </div>
      )}

      {/* TAB CONTENT */}
      {activeTab === 'benpos' && (
        <div>
          {/* FILTER BAR */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search by Name or PAN..."
              value={benposSearch}
              onChange={(e) => setBenposSearch(e.target.value)}
              style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', width: '220px', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#8B1A1A'}
              onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}
            >
              <option value="All">All Categories</option>
              <option value="NRI">NRI</option>
              <option value="Resident">Resident</option>
              <option value="Mutual Fund">Mutual Fund</option>
              <option value="NPS Trust">NPS Trust</option>
              <option value="Category II AIF">Category II AIF</option>
              <option value="PF Trust">PF Trust</option>
              <option value="Insurance">Insurance</option>
            </select>
            <button style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
              Search
            </button>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                ↓ Export Excel
              </button>
              <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                ↓ Export PDF
              </button>
            </div>
          </div>

          {/* SUMMARY PILLS */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '12px', display: 'flex', gap: '20px', border: '1px solid #F3F4F6' }}>
            <span style={{ fontSize: '13px', color: '#1A1A1A' }}>Total Unit Holders: 1,248</span>
            <span style={{ fontSize: '13px', color: '#166534', fontWeight: '600' }}>● Active: 1,102</span>
            <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: '600' }}>● Inactive: 146</span>
          </div>

          {/* TABLE */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#8B1A1A', color: 'white' }}>
                  {['DPCLIENTID', 'PAN', 'INVESTOR NAME', 'CATEGORY', 'UNITS HELD', 'TDS%', 'STATUS', 'BENPOS DATE'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBenpos.length > 0 ? (
                  filteredBenpos.map((row, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FDF0F0' : 'white' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.dpId}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.pan}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', fontWeight: '500' }}>{row.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.category}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.units.toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.tds}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>
                        <span style={{ 
                          backgroundColor: row.status === 'Active' ? '#F0FDF4' : '#F3F4F6', 
                          color: row.status === 'Active' ? '#166534' : '#6B7280', 
                          borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' 
                        }}>
                          {row.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.date}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: '#6B7280', padding: '32px' }}>No records found matching your search</td>
                  </tr>
                )}
                <tr style={{ backgroundColor: '#8B1A1A', color: 'white', fontWeight: 'bold' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>TOTAL</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>5,70,500</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>Active: 1,102 / Inactive: 146</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                </tr>
              </tbody>
            </table>
            <div style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6B7280', fontSize: '13px' }}>Showing 1–10 of 1,248 records</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 10px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>← Prev</button>
                <button style={{ backgroundColor: '#8B1A1A', color: 'white', borderRadius: '6px', padding: '6px 12px', border: 'none', fontWeight: 'bold' }}>1</button>
                <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>2</button>
                <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>3</button>
                <span style={{ alignSelf: 'center', color: '#6B7280' }}>...</span>
                <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>125</button>
                <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 10px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>Next →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'master' && (
        <div>
          {/* FILTER BAR */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}>
              <option>FY 2025-26</option>
              <option>FY 2024-25</option>
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                ↓ Export Excel
              </button>
              <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                ↓ Export PDF
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#8B1A1A', color: 'white' }}>
                  {['FY', 'QUARTER', 'UNIT RATE', 'CREATED BY', 'CREATED ON', 'APPROVED BY', 'APPROVED ON', 'STATUS'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {masterData.map((row, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FDF0F0' : 'white' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.fy}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.q}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', color: '#8B1A1A', fontWeight: '600' }}>
                      {row.rate}
                      <span style={{ 
                        fontSize: '11px', marginLeft: '4px', 
                        color: row.trend === 'up' ? '#166534' : row.trend === 'down' ? '#DC2626' : '#6B7280' 
                      }}>
                        {row.trend === 'up' ? '↑' : row.trend === 'down' ? '↓' : '→'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.createdBy}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.createdOn}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', color: row.approvedBy === '—' ? '#9CA3AF' : 'inherit' }}>{row.approvedBy}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', color: row.approvedOn === '—' ? '#9CA3AF' : 'inherit' }}>{row.approvedOn}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>
                      <span style={{ 
                        backgroundColor: row.status === 'Approved' ? '#F0FDF4' : '#FEF3C7', 
                        color: row.status === 'Approved' ? '#166534' : '#92400E', 
                        borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' 
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quarter' && (
        <div>
          {/* FILTER BAR */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select value={qwFY} onChange={(e) => setQwFY(e.target.value)} style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}>
              <option>FY 2025-26</option>
              <option>FY 2024-25</option>
            </select>
            <select value={qwQuarter} onChange={(e) => setQwQuarter(e.target.value)} style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}>
              <option>Q1</option>
              <option>Q2</option>
              <option>Q3</option>
              <option>Q4</option>
            </select>
            <button 
              onClick={() => setQwGenerated(true)}
              style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 24px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}
            >
              Generate Report
            </button>
            {qwGenerated && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                  ↓ Export Excel
                </button>
                <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                  ↓ Export PDF
                </button>
              </div>
            )}
          </div>

          {!qwGenerated ? (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '64px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <BarChart2 size={48} color="#D4A0A0" style={{ margin: '0 auto' }} />
              <p style={{ color: '#6B7280', marginTop: '12px', fontSize: '14px' }}>
                Select Financial Year and Quarter, then click Generate Report
              </p>
            </div>
          ) : (
            <div>
              {/* SUMMARY BANNER */}
              <div style={{ backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '12px', padding: '20px 24px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ fontWeight: 'bold', fontSize: '16px', color: '#8B1A1A', margin: 0 }}>{qwQuarter} {qwFY} — Distribution Report</h3>
                    <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '2px' }}>Generated: 02 Mar 2026  •  All data verified</p>
                  </div>
                  <span style={{ backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '20px', padding: '6px 12px', fontSize: '13px', fontWeight: '600' }}>
                    ✅ Approved & Locked
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '16px' }}>
                  <div>
                    <p style={{ fontSize: '10px', color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>TOTAL INVESTORS</p>
                    <p style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '20px', margin: 0 }}>1,102</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>UNIT RATE</p>
                    <p style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '20px', margin: 0 }}>0.1250</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>TOTAL GROSS DIVIDEND</p>
                    <p style={{ color: '#1A1A1A', fontWeight: 'bold', fontSize: '20px', margin: 0 }}>₹49,437.50</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10px', color: '#6B7280', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>TOTAL NET PAYABLE</p>
                    <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '20px', margin: 0 }}>₹41,368.75</p>
                  </div>
                </div>
              </div>

              {/* TABLE */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#8B1A1A', color: 'white' }}>
                      {['DPCLIENTID', 'INVESTOR NAME', 'UNITS', 'UNIT RATE', 'GROSS DIVIDEND', 'TDS%', 'TDS AMOUNT', 'NET PAYABLE'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {qwData.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FDF0F0' : 'white' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.id}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', fontWeight: '500' }}>{row.name}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.units}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.rate}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.gross}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.tds}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', color: '#DC2626', fontWeight: '500' }}>{row.tdsAmt}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', color: '#166534', fontWeight: '600' }}>{row.net}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#8B1A1A', color: 'white', fontWeight: 'bold' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>TOTAL DISTRIBUTION</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>3,95,500</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>₹49,437.50</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>₹8,068.75</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>₹41,368.75</td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', padding: '16px' }}>
                  <span style={{ color: '#6B7280', fontSize: '13px' }}>Showing 1–8 of 1,102 records</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'investor' && (
        <div>
          {/* SEARCH SECTION */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
            <h3 style={{ fontWeight: '600', color: '#8B1A1A', fontSize: '15px', marginBottom: '16px', marginTop: 0 }}>Search Investor</h3>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>PAN Number</label>
                <input
                  type="text"
                  value={iwInput}
                  onChange={(e) => setIwInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setIwSearched(true) }}
                  placeholder="e.g. IJKLM9012N"
                  style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', width: '100%' }}
                />
              </div>
              <div style={{ alignSelf: 'center', color: '#9CA3AF', fontSize: '13px', paddingBottom: '2px' }}>OR</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px' }}>DPCLIENTID</label>
                <input
                  type="text"
                  value={iwInput}
                  onChange={(e) => setIwInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') setIwSearched(true) }}
                  placeholder="e.g. DPCL00109"
                  style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', width: '100%' }}
                />
              </div>
              <button 
                onClick={() => setIwSearched(true)}
                style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: '600', cursor: 'pointer' }}
              >
                Search Investor
              </button>
              <button 
                onClick={() => { setIwSearched(false); setIwInput(''); }}
                style={{ border: '1px solid #D1D5DB', color: '#6B7280', backgroundColor: 'white', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
          </div>

          {!iwSearched ? (
            <div style={{ backgroundColor: '#FDF0F0', borderRadius: '12px', padding: '32px', textAlign: 'center', border: '1px solid #D4A0A0' }}>
              <div style={{ fontSize: '36px' }}>🔍</div>
              <p style={{ color: '#8B1A1A', fontWeight: '500', marginTop: '8px', fontSize: '14px' }}>
                Enter a PAN number or DPCLIENTID to view an investor's complete distribution history
              </p>
              <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px' }}>
                e.g. IJKLM9012N or DPCL00109
              </p>
            </div>
          ) : (
            <div>
              {/* INVESTOR PROFILE CARD */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FDF0F0', border: '2px solid #D4A0A0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', color: '#8B1A1A', flexShrink: 0 }}>
                  PA
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1A1A1A', margin: 0 }}>Prasad Agents Pvt Ltd</h3>
                    <span style={{ backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '20px', padding: '4px 10px', fontSize: '12px', fontWeight: '600' }}>Active</span>
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '20px', color: '#6B7280', fontSize: '13px' }}>
                    <span>PAN: IJKLM9012N</span>
                    <span>DPCLIENTID: DPCL00109</span>
                    <span>Category: PF Trust</span>
                  </div>
                  <div style={{ marginTop: '6px', display: 'flex', gap: '20px', fontSize: '13px' }}>
                    <span style={{ color: '#8B1A1A', fontWeight: '600' }}>Current Units: 1,00,000</span>
                    <span style={{ color: '#6B7280' }}>TDS Rate: 15%</span>
                    <span style={{ color: '#6B7280' }}>BENPOS Date: 15 Jan 2026</span>
                  </div>
                </div>
              </div>

              {/* LIFETIME SUMMARY */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                {[
                  { label: 'Total Gross Received', value: '₹71,150.00', color: '#8B1A1A' },
                  { label: 'Total TDS Deducted', value: '₹10,673.00', color: '#DC2626' },
                  { label: 'Total Net Received', value: '₹60,478.00', color: '#166534' }
                ].map((card, i) => (
                  <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', marginTop: 0 }}>{card.label}</p>
                    <p style={{ color: card.color, fontWeight: 'bold', fontSize: '20px', margin: 0 }}>{card.value}</p>
                  </div>
                ))}
              </div>

              {/* DISTRIBUTION HISTORY TABLE */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontWeight: '600', color: '#8B1A1A', fontSize: '15px', margin: 0 }}>Distribution History</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                    ↓ Export Excel
                  </button>
                  <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>
                    ↓ Export PDF
                  </button>
                </div>
              </div>
              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#8B1A1A', color: 'white' }}>
                      {['FY', 'QUARTER', 'UNITS', 'UNIT RATE', 'GROSS DIVIDEND', 'TDS%', 'TDS AMOUNT', 'NET PAYABLE', 'STATUS'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {iwHistory.map((row, i) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FDF0F0' : 'white' }}>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.fy}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.q}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.units}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.rate}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.gross}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.tds}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', color: '#DC2626', fontWeight: '500' }}>{row.tdsAmt}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', color: '#166534', fontWeight: '600' }}>{row.net}</td>
                        <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>
                          <span style={{ 
                            backgroundColor: row.status === 'Approved' ? '#F0FDF4' : '#FEF3C7', 
                            color: row.status === 'Approved' ? '#166534' : '#92400E', 
                            borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' 
                          }}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: '#8B1A1A', color: 'white', fontWeight: 'bold' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>TOTAL</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>5,80,000</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>₹71,150.00</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>₹10,672.50</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>₹60,477.50</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px' }}>—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};
