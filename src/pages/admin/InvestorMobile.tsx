import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  FileText, 
  Upload, 
  Bell, 
  Download, 
  CheckCircle, 
  Smartphone,
  ChevronRight
} from 'lucide-react';

export const InvestorMobile = () => {
  const navigate = useNavigate();
  const [mobileScreen, setMobileScreen] = useState('dashboard');
  const [uploadFile, setUploadFile] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [phoneToast, setPhoneToast] = useState('');

  const showPhoneToast = (msg: string) => {
    setPhoneToast(msg);
    setTimeout(() => setPhoneToast(''), 1500);
  };

  const renderScreen = () => {
    switch (mobileScreen) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '780px' }}>
            {/* HEADER */}
            <div style={{ backgroundColor: '#8B1A1A' }}>
              <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  lineHeight: 1.1
                }}>
                  <span style={{ 
                    color: 'white', 
                    fontWeight: '800', 
                    fontSize: '14px', 
                    letterSpacing: '2px' 
                  }}>
                    VERTIS
                  </span>
                  <span style={{ 
                    color: 'rgba(255,255,255,0.65)', 
                    fontSize: '7px', 
                    letterSpacing: '1.5px',
                    fontWeight: '500'
                  }}>
                    INFRASTRUCTURE TRUST
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Bell size={20} color="white" />
                  <div style={{ width: '30px', height: '30px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '11px' }}>
                    PA
                  </div>
                </div>
              </div>

              <div style={{ padding: '6px 16px 16px' }}>
                <p style={{ color: 'white', opacity: 0.8, fontSize: '12px', margin: 0 }}>Welcome back,</p>
                <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', marginTop: '2px', marginBottom: 0 }}>Prasad Agents Pvt Ltd</h2>
                <p style={{ color: 'white', opacity: 0.6, fontSize: '11px', marginTop: '2px', marginBottom: 0 }}>PAN: IJKLM9012N  •  DPCL00109</p>
              </div>

              <div style={{ padding: '0 16px 20px', display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ color: 'white', opacity: 0.7, fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', margin: 0 }}>CURRENT UNITS</p>
                  <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginTop: '4px', marginBottom: 0 }}>1,00,000</p>
                </div>
                <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ color: 'white', opacity: 0.7, fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px', margin: 0 }}>LAST NET PAYOUT</p>
                  <p style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', marginTop: '4px', marginBottom: 0 }}>₹11,050</p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div style={{ flex: 1, backgroundColor: '#F5F0E8', padding: '16px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '15px', margin: 0 }}>Q3 FY 2025-26</h3>
                  <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '600' }}>Pending Approval</span>
                </div>
                
                <div style={{ borderTop: '1px solid #F3F4F6', marginBottom: '12px' }} />
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>Gross Dividend</p>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 }}>₹12,500.00</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>TDS Deducted</p>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#DC2626', margin: 0 }}>₹1,875.00</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>Unit Rate</p>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#1A1A1A', margin: 0 }}>0.1250</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>Net Payable</p>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534', margin: 0 }}>₹10,625.00</p>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '14px', margin: 0 }}>Distribution History</h3>
                <span style={{ color: '#8B1A1A', fontSize: '12px', cursor: 'pointer' }}>See all →</span>
              </div>

              {[
                { q: 'Q3 FY 2025-26', units: '1,00,000', net: '₹10,625.00', status: 'Pending Approval', statusColor: '#92400E', statusBg: '#FEF3C7' },
                { q: 'Q2 FY 2025-26', units: '1,00,000', net: '₹11,050.00', status: 'Approved', statusColor: '#166534', statusBg: '#F0FDF4' },
                { q: 'Q1 FY 2025-26', units: '1,00,000', net: '₹10,625.00', status: 'Approved', statusColor: '#166534', statusBg: '#F0FDF4' },
                { q: 'Q4 FY 2024-25', units: '95,000', net: '₹9,690.00', status: 'Approved', statusColor: '#166534', statusBg: '#F0FDF4' },
                { q: 'Q3 FY 2024-25', units: '95,000', net: '₹9,690.00', status: 'Approved', statusColor: '#166534', statusBg: '#F0FDF4' },
              ].map((item, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '13px', color: '#1A1A1A', margin: 0 }}>{item.q}</p>
                    <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '2px', marginBottom: 0 }}>Units: {item.units}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#166534', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>{item.net}</p>
                    <span style={{ backgroundColor: item.statusBg, color: item.statusColor, borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '600', display: 'inline-block', marginTop: '4px' }}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
              <div style={{ height: '80px' }} />
            </div>
            {renderBottomNav('dashboard')}
          </div>
        );
      case 'reports':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '780px' }}>
            <div style={{ backgroundColor: '#8B1A1A', padding: '16px' }}>
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>← My Reports</h2>
              <p style={{ color: 'white', opacity: 0.7, fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>Quarterly distribution statements</p>
            </div>
            <div style={{ flex: 1, backgroundColor: '#F5F0E8', padding: '16px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px' }}>
                <h3 style={{ fontWeight: '600', color: '#1A1A1A', marginBottom: '12px', fontSize: '14px', marginTop: 0 }}>Select Period</h3>
                <select style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '10px', padding: '10px', fontSize: '14px', marginBottom: '10px', outline: 'none' }}>
                  <option>FY 2025-26</option>
                  <option>FY 2024-25</option>
                </select>
                <select style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '10px', padding: '10px', fontSize: '14px', marginBottom: '12px', outline: 'none' }}>
                  <option>Q1</option>
                  <option>Q2</option>
                  <option selected>Q3</option>
                  <option>Q4</option>
                </select>
                <button 
                  onClick={() => showPhoneToast('📊 Loading report...')}
                  style={{ width: '100%', backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  View Report
                </button>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div style={{ backgroundColor: '#FDF0F0', padding: '12px 16px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', color: '#8B1A1A', fontSize: '14px' }}>Q3 FY 2025-26 Distribution</span>
                  <span style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '600' }}>Pending</span>
                </div>
                
                {[
                  { label: 'Units Held', value: '1,00,000' },
                  { label: 'Unit Rate', value: '0.1250 per unit' },
                  { label: 'Gross Dividend', value: '₹12,500.00' },
                  { label: 'TDS Rate', value: '15%' },
                  { label: 'TDS Deducted', value: '₹1,875.00', bold: true, color: '#DC2626' },
                ].map((row, i) => (
                  <div key={i} style={{ padding: '10px 16px', borderBottom: '1px solid #F9F9F9', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '13px', color: '#6B7280' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', color: row.color || '#1A1A1A', fontWeight: row.bold ? 'bold' : '500' }}>{row.value}</span>
                  </div>
                ))}
                
                <div style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 'bold' }}>NET PAYABLE</span>
                  <span style={{ fontSize: '18px', color: '#166534', fontWeight: 'bold' }}>₹10,625.00</span>
                </div>

                <div style={{ padding: '16px' }}>
                  <button 
                    onClick={() => showPhoneToast('⬇ Preparing download...')}
                    style={{ width: '100%', backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    ↓ Download Statement
                  </button>
                  <button 
                    onClick={() => showPhoneToast('⬇ Preparing PDF...')}
                    style={{ width: '100%', border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer', marginTop: '8px' }}
                  >
                    ↓ Download PDF
                  </button>
                </div>
              </div>
              <div style={{ height: '80px' }} />
            </div>
            {renderBottomNav('reports')}
          </div>
        );
      case 'documents':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '780px' }}>
            <div style={{ backgroundColor: '#8B1A1A', padding: '16px' }}>
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>← My Documents</h2>
              <p style={{ color: 'white', opacity: 0.7, fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>Tax documents from Vertis Infrastructure Trust</p>
            </div>
            <div style={{ flex: 1, backgroundColor: '#F5F0E8', padding: '16px' }}>
              <div style={{ backgroundColor: '#FDF0F0', borderLeft: '4px solid #8B1A1A', borderRadius: '0 8px 8px 0', padding: '12px', marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#8B1A1A', fontWeight: '500', margin: 0 }}>
                  🔒 Only documents linked to your PAN (IJKLM9012N) are visible here.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <select style={{ flex: 1, border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px', fontSize: '12px', outline: 'none' }}>
                  <option>All FY</option>
                  <option>FY 2025-26</option>
                  <option>FY 2024-25</option>
                </select>
                <select style={{ flex: 1, border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px', fontSize: '12px', outline: 'none' }}>
                  <option>All Quarters</option>
                  <option>Q1</option>
                  <option>Q2</option>
                  <option>Q3</option>
                </select>
              </div>

              <h3 style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '14px', marginBottom: '10px', marginTop: 0 }}>Available Documents (4)</h3>

              {[
                { name: 'Form 16', q: 'Q3 FY 2025-26' },
                { name: 'Form 15CA-CB', q: 'Q3 FY 2025-26' },
                { name: 'Form 64B', q: 'Q2 FY 2025-26' },
                { name: 'Form 16', q: 'Q2 FY 2025-26' },
              ].map((doc, i) => (
                <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', padding: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#FDF0F0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <FileText size={18} color="#8B1A1A" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '13px', margin: 0 }}>{doc.name}</p>
                    <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '2px', marginBottom: 0 }}>{doc.q}</p>
                    <span style={{ backgroundColor: '#F0FDF4', color: '#166534', fontSize: '10px', borderRadius: '20px', padding: '1px 6px', marginTop: '4px', display: 'inline-block' }}>Available</span>
                  </div>
                  <div 
                    onClick={() => showPhoneToast('⬇ Downloading...')}
                    style={{ width: '36px', height: '36px', backgroundColor: '#8B1A1A', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}
                  >
                    <Download size={16} color="white" />
                  </div>
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <p style={{ color: '#6B7280', fontSize: '12px', margin: 0 }}>Need a document not listed here?</p>
                <span style={{ color: '#8B1A1A', fontWeight: '500', fontSize: '12px', display: 'block', marginTop: '4px' }}>investor@vertis.co.in</span>
              </div>
              <div style={{ height: '80px' }} />
            </div>
            {renderBottomNav('documents')}
          </div>
        );
      case 'upload':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '780px' }}>
            <div style={{ backgroundColor: '#8B1A1A', padding: '16px' }}>
              <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>← Upload Documents</h2>
              <p style={{ color: 'white', opacity: 0.7, fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>Submit compliance documents</p>
            </div>
            <div style={{ flex: 1, backgroundColor: '#F5F0E8', padding: '16px' }}>
              <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '14px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: '#FDF0F0', border: '2px solid #D4A0A0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B1A1A', fontWeight: 'bold', fontSize: '14px' }}>
                  PA
                </div>
                <div>
                  <p style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '13px', margin: 0 }}>Prasad Agents Pvt Ltd</p>
                  <p style={{ color: '#6B7280', fontSize: '11px', margin: 0 }}>PAN: IJKLM9012N</p>
                  <p style={{ color: '#6B7280', fontSize: '11px', margin: 0 }}>Category: PF Trust</p>
                </div>
              </div>

              <div style={{ backgroundColor: 'white', borderRadius: '14px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '14px' }}>
                <h3 style={{ fontWeight: 'bold', color: '#8B1A1A', fontSize: '14px', marginBottom: '14px', marginTop: 0 }}>Upload Compliance Document</h3>
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>Year</label>
                  <select style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '13px', outline: 'none' }}>
                    <option>FY 2025-26</option>
                    <option>FY 2024-25</option>
                  </select>
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>Your Category</label>
                  <div style={{ backgroundColor: '#FDF0F0', borderRadius: '8px', padding: '10px', marginTop: '4px' }}>
                    <p style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '13px', margin: 0 }}>PF Trust</p>
                    <p style={{ color: '#9CA3AF', fontSize: '10px', margin: 0 }}>🔒 Auto-assigned</p>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px', display: 'block' }}>Document Type</label>
                  <select style={{ width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '13px', outline: 'none' }}>
                    <option>Registration Certificate</option>
                    <option>IT Exemption Certificate</option>
                  </select>
                </div>

                <div style={{ backgroundColor: '#FDF0F0', borderRadius: '8px', padding: '10px', marginBottom: '14px' }}>
                  <p style={{ fontWeight: '600', color: '#8B1A1A', fontSize: '11px', margin: 0 }}>📋 Filename must match your PAN:</p>
                  <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#1A1A1A', marginTop: '4px', marginBottom: 0 }}>IJKLM9012N_[document].pdf</p>
                </div>

                {!uploadFile ? (
                  <div 
                    onClick={() => setUploadFile(true)}
                    style={{ border: '2px dashed #D4A0A0', borderRadius: '12px', padding: '24px', textAlign: 'center', cursor: 'pointer' }}
                  >
                    <Upload size={28} color="#D4A0A0" style={{ margin: '0 auto' }} />
                    <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '8px', marginBottom: 0 }}>Tap to select file</p>
                    <button style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', marginTop: '12px', fontWeight: '600', fontSize: '13px' }}>
                      Select File
                    </button>
                  </div>
                ) : !uploadDone ? (
                  <div style={{ backgroundColor: '#F0FDF4', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText color="#166534" size={16} />
                      <span style={{ fontSize: '12px', color: '#1A1A1A', fontWeight: '500', flex: 1 }}>IJKLM9012N_registration.pdf</span>
                      <CheckCircle color="#166534" size={14} />
                    </div>
                    <p style={{ color: '#6B7280', fontSize: '11px', marginTop: '4px', marginBottom: 0 }}>2.1 MB</p>
                    <p style={{ color: '#166534', fontSize: '11px', marginTop: '2px', marginBottom: 0 }}>✓ Filename matches your PAN</p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <CheckCircle size={48} color="#166534" style={{ margin: '0 auto' }} />
                    <p style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '16px', marginTop: '12px', marginBottom: 0 }}>Uploaded Successfully!</p>
                    <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '6px', marginBottom: 0 }}>Your document has been submitted for review.</p>
                    <button 
                      onClick={() => { 
                        setUploadFile(false); 
                        setUploadDone(false); 
                      }}
                      style={{ width: '100%', border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '10px', padding: '12px', fontWeight: '600', marginTop: '16px', cursor: 'pointer' }}
                    >
                      Upload Another
                    </button>
                  </div>
                )}

                {uploadFile && !uploadDone && (
                  <button 
                    onClick={() => setTimeout(() => setUploadDone(true), 1500)}
                    style={{ width: '100%', backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', marginTop: '12px', cursor: 'pointer' }}
                  >
                    Upload Document
                  </button>
                )}
              </div>

              <div style={{ marginTop: '16px' }}>
                <h3 style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '14px', marginBottom: '10px', marginTop: 0 }}>Upload History</h3>
                {[
                  { name: 'Registration Certificate', fy: 'FY 2025-26', status: 'Submitted', color: '#92400E', bg: '#FEF3C7', date: '01 Mar 2026' },
                  { name: 'IT Exemption Cert', fy: 'FY 2024-25', status: 'Approved', color: '#166534', bg: '#F0FDF4', date: '15 Dec 2024' },
                  { name: 'Registration Certificate', fy: 'FY 2024-25', status: 'Approved', color: '#166534', bg: '#F0FDF4', date: '14 Dec 2024' },
                ].map((item, i) => (
                  <div key={i} style={{ backgroundColor: 'white', borderRadius: '10px', padding: '12px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '500', color: '#1A1A1A', margin: 0 }}>{item.name}</p>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>{item.fy}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ backgroundColor: item.bg, color: item.color, borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '600' }}>{item.status}</span>
                      <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px', marginBottom: 0 }}>{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ height: '80px' }} />
            </div>
            {renderBottomNav('upload')}
          </div>
        );
      default:
        return null;
    }
  };

  const renderBottomNav = (active: string) => (
    <div style={{
      position: 'sticky',
      bottom: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #E5E7EB',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 4px',
      zIndex: 10
    }}>
      {[
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'reports', label: 'Reports', icon: BarChart2 },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'upload', label: 'Upload', icon: Upload },
      ].map(item => (
        <div 
          key={item.id}
          onClick={() => setMobileScreen(item.id)}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', cursor: 'pointer', padding: '4px 12px' }}
        >
          <item.icon size={20} color={active === item.id ? '#8B1A1A' : '#9CA3AF'} />
          <span style={{ fontSize: '10px', color: active === item.id ? '#8B1A1A' : '#9CA3AF', fontWeight: active === item.id ? '600' : '400' }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#F5F0E8', minHeight: '100vh', padding: '40px 20px', position: 'relative' }}>
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate('/admin/dashboard')}
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid #D1D5DB',
          backgroundColor: 'white',
          color: '#374151',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '13px',
          cursor: 'pointer',
          fontWeight: '500'
        }}
      >
        ← Back to Admin
      </button>

      {/* PAGE HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px' }}>
          Investor Mobile App Preview
        </h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Preview of what investors see on their devices
        </p>
      </div>

      {/* SCREEN SELECTOR */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard' },
          { id: 'reports', label: '📋 My Reports' },
          { id: 'documents', label: '📄 Documents' },
          { id: 'upload', label: '⬆ Upload Docs' }
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setMobileScreen(btn.id)}
            style={{
              backgroundColor: mobileScreen === btn.id ? '#8B1A1A' : 'white',
              color: mobileScreen === btn.id ? 'white' : '#6B7280',
              border: mobileScreen === btn.id ? 'none' : '1px solid #D1D5DB',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: mobileScreen === btn.id ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* PHONE FRAME */}
      <div style={{ width: '393px', margin: '0 auto' }}>
        <div style={{
          border: '10px solid #1A1A1A',
          borderRadius: '44px',
          boxShadow: '0 0 0 1px #333, 0 30px 80px rgba(0,0,0,0.4)',
          overflow: 'hidden',
          backgroundColor: '#1A1A1A',
          position: 'relative'
        }}>
          {/* STATUS BAR */}
          <div style={{ height: '44px', backgroundColor: '#8B1A1A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', position: 'relative' }}>
            <span style={{ color: 'white', fontSize: '13px', fontWeight: '600' }}>9:41</span>
            <div style={{
              position: 'absolute', top: 0,
              left: '50%', transform: 'translateX(-50%)',
              width: '120px', height: '30px',
              backgroundColor: '#1A1A1A',
              borderRadius: '0 0 20px 20px'
            }}/>
            <span style={{ color: 'white', fontSize: '11px' }}>100%</span>
          </div>

          {/* SCREEN AREA */}
          <div style={{
            height: '780px',
            overflowY: 'auto',
            backgroundColor: '#F5F0E8',
            scrollbarWidth: 'none',
            position: 'relative'
          }}>
            {renderScreen()}
            
            {phoneToast !== '' && (
              <div style={{
                position: 'absolute', bottom: '80px',
                left: '50%', transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0,0,0,0.75)',
                color: 'white', borderRadius: '20px',
                padding: '8px 16px', fontSize: '12px',
                whiteSpace: 'nowrap', zIndex: 20
              }}>
                {phoneToast}
              </div>
            )}
          </div>

          {/* HOME INDICATOR */}
          <div style={{ height: '28px', backgroundColor: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '120px', height: '5px', backgroundColor: '#1A1A1A', borderRadius: '3px', opacity: 0.3 }}/>
          </div>
        </div>
      </div>
    </div>
  );
};
