import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Download, 
  Folder, 
  List, 
  LayoutGrid,
  AlertCircle,
  X
} from 'lucide-react';

export const DocumentManagement = () => {
  // STATE VARIABLES
  const [activeTab, setActiveTab] = useState('upload');
  const [step, setStep] = useState(1); // 1, 2, 3
  const [selectedFY, setSelectedFY] = useState('');
  const [selectedQuarter, setSelectedQuarter] = useState('');
  const [selectedDocType, setSelectedDocType] = useState('');
  const [docErrors, setDocErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false);
  const [processingDone, setProcessingDone] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [libView, setLibView] = useState('list'); // 'list' | 'folder'
  const [libSearch, setLibSearch] = useState('');
  const [exportToast, setExportToast] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['FY 2025-26']);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editPAN, setEditPAN] = useState('');
  const [editError, setEditError] = useState('');
  const [remappedRows, setRemappedRows] = useState<Record<number, { pan: string; investorName: string; status: 'mapped' }>>({});
  const [mappingFilter, setMappingFilter] = useState<'all' | 'mapped' | 'rejected'>('all');
  const [renamingIndex, setRenamingIndex] = useState<number | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [renameError, setRenameError] = useState('');
  const [renamedFiles, setRenamedFiles] = useState<Record<number, { newName: string; valid: boolean }>>({});

  // EXPORT TOAST LOGIC
  useEffect(() => {
    if (exportToast) {
      const t = setTimeout(() => setExportToast(false), 1500);
      return () => clearTimeout(t);
    }
  }, [exportToast]);

  const handleExport = () => setExportToast(true);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => 
      prev.includes(folder) ? prev.filter(f => f !== folder) : [...prev, folder]
    );
  };

  // MOCK DATA FOR LIBRARY
  const libraryDocs = [
    { pan: 'ABCDE1234F', name: 'Rajesh Kumar Iyer', type: 'Form 16', fy: 'FY 2025-26', q: 'Q3', date: '01 Mar 2026', by: 'Ashish Ranjan' },
    { pan: 'BCDFE2345G', name: 'Priya Sharma', type: 'Form 16', fy: 'FY 2025-26', q: 'Q3', date: '01 Mar 2026', by: 'Ashish Ranjan' },
    { pan: 'CDEFG3456H', name: 'Krishnamurthy Ventures Pvt Ltd', type: 'Form 16', fy: 'FY 2025-26', q: 'Q3', date: '01 Mar 2026', by: 'Ashish Ranjan' },
    { pan: 'DEFGH4567I', name: 'Sunita Deshmukh', type: 'Form 16', fy: 'FY 2025-26', q: 'Q3', date: '01 Mar 2026', by: 'Ashish Ranjan' },
    { pan: 'ABCDE1234F', name: 'Rajesh Kumar Iyer', type: 'Form 15CA-CB', fy: 'FY 2025-26', q: 'Q2', date: '05 Nov 2025', by: 'Rahul Sharma' },
    { pan: 'BCDFE2345G', name: 'Priya Sharma', type: 'Form 15CA-CB', fy: 'FY 2025-26', q: 'Q2', date: '05 Nov 2025', by: 'Rahul Sharma' },
    { pan: 'CDEFG3456H', name: 'Krishnamurthy Ventures Pvt Ltd', type: 'Form 64B', fy: 'FY 2025-26', q: 'Q1', date: '10 Aug 2025', by: 'Ashish Ranjan' },
    { pan: 'DEFGH4567I', name: 'Sunita Deshmukh', type: 'Form 64B', fy: 'FY 2025-26', q: 'Q1', date: '10 Aug 2025', by: 'Ashish Ranjan' },
    { pan: 'IJKLM9012N', name: 'Prasad Agents Pvt Ltd', type: 'Form 16', fy: 'FY 2025-26', q: 'Q2', date: '05 Nov 2025', by: 'Rahul Sharma' },
    { pan: 'JKLMN0123O', name: 'Northern Star Insurance Co', type: 'Form 16', fy: 'FY 2024-25', q: 'Q4', date: '15 Apr 2025', by: 'Ashish Ranjan' },
  ];

  // INVESTOR LOOKUP MAP
  const investorLookup: Record<string, string> = {
    'ABCDE1234F': 'Rajesh Kumar Iyer',
    'BCDFE2345G': 'Priya Sharma',
    'CDEFG3456H': 'Krishnamurthy Ventures Pvt Ltd',
    'DEFGH4567I': 'Sunita Deshmukh',
    'IJKLM9012N': 'Prasad Agents Pvt Ltd',
    'JKLMN0123O': 'Northern Star Insurance Co',
  };

  // MAPPING DATA
  const allMappingRows: { file: string; pan: string | null; name: string | null; status: 'mapped' | 'rejected' }[] = [
    { file: 'ABCDE1234F_2025-26_Q3_Form16.pdf', pan: 'ABCDE1234F', name: 'Rajesh Kumar Iyer', status: 'mapped' },
    { file: 'BCDFE2345G_2025-26_Q3_Form16.pdf', pan: 'BCDFE2345G', name: 'Priya Sharma', status: 'mapped' },
    { file: 'CDEFG3456H_2025-26_Q3_Form16.pdf', pan: 'CDEFG3456H', name: 'Krishnamurthy Ventures Pvt Ltd', status: 'mapped' },
    { file: 'DEFGH4567I_2025-26_Q3_Form16.pdf', pan: 'DEFGH4567I', name: 'Sunita Deshmukh', status: 'mapped' },
    { file: 'INVALID_FILENAME_2026.pdf', pan: null, name: null, status: 'rejected' },
  ];

  // DERIVED COUNTS
  const totalRemapped = Object.keys(remappedRows).length;
  const mappedCount = allMappingRows.filter(r => r.status === 'mapped').length + totalRemapped;
  const rejectedCount = allMappingRows.filter(r => r.status === 'rejected').length - totalRemapped;

  // FILTERED ROWS
  const filteredRows = allMappingRows
    .map((row, i) => ({ ...row, index: i }))
    .filter(row => {
      if (mappingFilter === 'all') return true;
      if (mappingFilter === 'mapped') return row.status === 'mapped' || !!remappedRows[row.index];
      if (mappingFilter === 'rejected') return row.status === 'rejected' && !remappedRows[row.index];
      return true;
    });

  // STEP 2 — FILE LIST DATA
  const mockFiles = [
    { name: 'ABCDE1234F_2025-26_Q3_Form16.pdf', size: '245 KB', valid: true },
    { name: 'BCDFE2345G_2025-26_Q3_Form16.pdf', size: '312 KB', valid: true },
    { name: 'CDEFG3456H_2025-26_Q3_Form16.pdf', size: '198 KB', valid: true },
    { name: 'DEFGH4567I_2025-26_Q3_Form16.pdf', size: '267 KB', valid: true },
    { name: 'INVALID_FILENAME_2026.pdf', size: '145 KB', valid: false },
  ];
  const totalRenamed = Object.keys(renamedFiles).length;
  const step2ValidCount = mockFiles.filter((f, i) => f.valid || renamedFiles[i]?.valid).length;
  const step2RejectedCount = mockFiles.filter((f, i) => !f.valid && !renamedFiles[i]).length;
  const allResolved = step2RejectedCount === 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* PAGE HEADER */}
      <div className="mb-6">
        <h1 style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '24px', marginBottom: '4px' }}>
          Document Management
        </h1>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>
          Upload and manage investor tax documents
        </p>
      </div>

      {/* TABS */}
      <div style={{ borderBottom: '2px solid #E5E7EB', display: 'flex', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('upload')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderBottom: activeTab === 'upload' ? '3px solid #8B1A1A' : 'none',
            marginBottom: activeTab === 'upload' ? '-2px' : '0',
            color: activeTab === 'upload' ? '#8B1A1A' : '#6B7280',
            fontWeight: activeTab === 'upload' ? '600' : '400',
            transition: 'all 0.2s'
          }}
        >
          Upload Documents
        </button>
        <button
          onClick={() => setActiveTab('library')}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            borderBottom: activeTab === 'library' ? '3px solid #8B1A1A' : 'none',
            marginBottom: activeTab === 'library' ? '-2px' : '0',
            color: activeTab === 'library' ? '#8B1A1A' : '#6B7280',
            fontWeight: activeTab === 'library' ? '600' : '400',
            transition: 'all 0.2s'
          }}
        >
          Document Library
        </button>
      </div>

      {/* TAB 1 — UPLOAD DOCUMENTS */}
      {activeTab === 'upload' && (
        <div>
          {uploadSuccess ? (
            <div style={{ textAlign: 'center', padding: '48px 24px' }}>
              <div style={{
                width: '72px', height: '72px',
                backgroundColor: '#F0FDF4',
                border: '2px solid #166534',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', margin: '0 auto',
                fontSize: '32px'
              }}>✅</div>
              
              <h2 style={{ fontWeight: 'bold', fontSize: '20px', color: '#1A1A1A', marginTop: '16px' }}>
                Documents Uploaded Successfully!
              </h2>
              <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>
                4 documents have been mapped and stored.
              </p>
              
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                <span style={{ backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#8B1A1A', fontWeight: '500' }}>
                  📅 {selectedFY}
                </span>
                <span style={{ backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#8B1A1A', fontWeight: '500' }}>
                  📋 {selectedQuarter}
                </span>
                <span style={{ backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#8B1A1A', fontWeight: '500' }}>
                  📄 {selectedDocType}
                </span>
              </div>

              <div style={{ marginTop: '20px', backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '12px', padding: '16px', textAlign: 'left', maxWidth: '400px', margin: '20px auto' }}>
                <p style={{ fontWeight: '600', color: '#8B1A1A', marginBottom: '8px', fontSize: '14px' }}>What happens next?</p>
                <ul style={{ fontSize: '13px', color: '#374151', paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '4px' }}>Documents are now stored in the Document Library</li>
                  <li style={{ marginBottom: '4px' }}>Investors can login to download their documents</li>
                  <li style={{ marginBottom: '4px' }}>Each investor sees only their own documents</li>
                  <li>Documents are searchable by PAN or quarter</li>
                </ul>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button 
                  onClick={() => {
                    setStep(1);
                    setFileSelected(false);
                    setProcessingDone(false);
                    setUploadSuccess(false);
                  }}
                  style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '10px', padding: '10px 20px', cursor: 'pointer', fontWeight: '600' }}
                >
                  ↩ Upload More Documents
                </button>
                <button 
                  onClick={() => setActiveTab('library')}
                  style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 20px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Go to Document Library →
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* STEP INDICATOR */}
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px', marginTop: '8px' }}>
                {[
                  { n: 1, label: 'Select Period' },
                  { n: 2, label: 'Upload Files' },
                  { n: 3, label: 'Confirm Mapping' }
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
                        fontWeight: step >= s.n ? '500' : '400'
                      }}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div style={{ 
                        height: '2px', flex: 1, margin: '0 8px', marginBottom: '20px',
                        backgroundColor: step > s.n ? '#166534' : '#E5E7EB'
                      }} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* STEP 1 — SELECT PERIOD */}
              {step === 1 && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
                  <h3 style={{ fontWeight: '600', color: '#8B1A1A', marginBottom: '4px', marginTop: 0 }}>Configure Upload</h3>
                  <p style={{ color: '#6B7280', fontSize: '13px', marginBottom: '20px' }}>Define the quarter and document type for this batch</p>
                  
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>
                        FINANCIAL YEAR <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <select 
                        value={selectedFY} 
                        onChange={(e) => {
                          setSelectedFY(e.target.value);
                          if (docErrors.fy) {
                            const newErrors = { ...docErrors };
                            delete newErrors.fy;
                            setDocErrors(newErrors);
                          }
                        }}
                        style={{ 
                          border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', outline: 'none',
                          ...(docErrors.fy ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : selectedFY ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                        }}
                      >
                        <option value="">Select FY</option>
                        <option>FY 2025-26</option>
                        <option>FY 2024-25</option>
                        <option>FY 2023-24</option>
                      </select>
                      {docErrors.fy && (
                        <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ⚠ {docErrors.fy}
                        </p>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>
                        QUARTER <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <select 
                        value={selectedQuarter} 
                        onChange={(e) => {
                          setSelectedQuarter(e.target.value);
                          if (docErrors.quarter) {
                            const newErrors = { ...docErrors };
                            delete newErrors.quarter;
                            setDocErrors(newErrors);
                          }
                        }}
                        style={{ 
                          border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', outline: 'none',
                          ...(docErrors.quarter ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : selectedQuarter ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                        }}
                      >
                        <option value="">Select Quarter</option>
                        <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
                      </select>
                      {docErrors.quarter && (
                        <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ⚠ {docErrors.quarter}
                        </p>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>
                        DOCUMENT TYPE <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <select 
                        value={selectedDocType} 
                        onChange={(e) => {
                          setSelectedDocType(e.target.value);
                          if (docErrors.docType) {
                            const newErrors = { ...docErrors };
                            delete newErrors.docType;
                            setDocErrors(newErrors);
                          }
                        }}
                        style={{ 
                          border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', width: '100%', outline: 'none',
                          ...(docErrors.docType ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : selectedDocType ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                        }}
                      >
                        <option value="">Select Type</option>
                        <option>Form 16</option>
                        <option>Form 15CA-CB</option>
                        <option>Form 64B</option>
                        <option>Other Documents</option>
                      </select>
                      {docErrors.docType && (
                        <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          ⚠ {docErrors.docType}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#FDF0F0', borderLeft: '4px solid #8B1A1A', borderRadius: '0 8px 8px 0', padding: '16px', marginTop: '20px' }}>
                    <p style={{ fontWeight: '600', color: '#8B1A1A', fontSize: '13px', marginBottom: '8px', marginTop: 0 }}>📁 Required File Naming Convention</p>
                    <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '10px 14px', fontFamily: 'monospace', fontSize: '13px', color: '#1A1A1A', marginBottom: '8px' }}>
                      PAN_[FY]_[Quarter]_[DocType].pdf
                    </div>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                      Example: <span style={{ fontFamily: 'monospace', color: '#8B1A1A', fontWeight: '500' }}>ABCDE1234F_2025-26_Q3_Form16.pdf</span>
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px', marginBottom: 0 }}>
                      PAN is auto-extracted from filename to map the document to the correct investor.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      const errors: Record<string, string> = {};
                      if (!selectedFY) errors.fy = 'Financial Year is required';
                      if (!selectedQuarter) errors.quarter = 'Quarter is required';
                      if (!selectedDocType) errors.docType = 'Document Type is required';

                      if (Object.keys(errors).length > 0) {
                        setDocErrors(errors);
                        return;
                      }
                      setDocErrors({});
                      setStep(2);
                    }}
                    style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', width: '100%', marginTop: '20px' }}
                  >
                    Continue to Upload →
                  </button>
                </div>
              )}

              {/* STEP 2 — UPLOAD FILES */}
              {step === 2 && (
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#8B1A1A', fontWeight: '500' }}>📅 {selectedFY}</span>
                    <span style={{ backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#8B1A1A', fontWeight: '500' }}>📋 {selectedQuarter}</span>
                    <span style={{ backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#8B1A1A', fontWeight: '500' }}>📄 {selectedDocType}</span>
                    <button onClick={() => setStep(1)} style={{ color: '#8B1A1A', fontSize: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', marginLeft: '8px' }}>← Edit</button>
                  </div>

                  <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
                    {!fileSelected ? (
                      <div 
                        onClick={() => {
                          // Simulate file selection
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = '.pdf';
                          input.multiple = true;
                          input.onchange = (e: any) => {
                            const files = e.target.files;
                            if (files && files.length > 0) {
                              const allPdf = Array.from(files).every((f: any) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
                              if (!allPdf) {
                                setDocErrors({ file: 'Only PDF files are allowed' });
                                return;
                              }
                              setDocErrors({});
                              setFileSelected(true);
                            }
                          };
                          input.click();
                        }}
                        style={{
                          border: docErrors.file ? '2px dashed #DC2626' : '2px dashed #D4A0A0',
                          borderRadius: '12px',
                          padding: '48px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: docErrors.file ? '#FEF2F2' : '#FAFAFA',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          if (!docErrors.file) {
                            e.currentTarget.style.borderColor = '#8B1A1A';
                            e.currentTarget.style.backgroundColor = '#FDF0F0';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!docErrors.file) {
                            e.currentTarget.style.borderColor = '#D4A0A0';
                            e.currentTarget.style.backgroundColor = '#FAFAFA';
                          }
                        }}
                      >
                        <Upload size={40} color={docErrors.file ? "#DC2626" : "#D4A0A0"} style={{ margin: '0 auto' }} />
                        <p style={{ fontWeight: '600', color: '#1A1A1A', marginTop: '12px', marginBottom: 0 }}>Drop PDF files here or click to browse</p>
                        <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>Accepts: PDF files only — Multiple files supported</p>
                        <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>Filename must match: PAN_Year_Quarter_Type.pdf</p>
                        <button style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 24px', marginTop: '16px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}>
                          Select Files
                        </button>
                        {docErrors.file && (
                          <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                            ⚠ {docErrors.file}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <span style={{ fontWeight: '600', color: '#1A1A1A' }}>{mockFiles.length} files selected</span>
                          <button
                            onClick={() => {
                              setFileSelected(false);
                              setRenamedFiles({});
                              setRenamingIndex(null);
                              setRenameValue('');
                              setRenameError('');
                            }}
                            style={{ color: '#DC2626', fontSize: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer' }}
                          >
                            Remove all
                          </button>
                        </div>

                        {/* FILE ROWS */}
                        <div>
                          {mockFiles.map((f, i) => {
                            // STATE 3 — inline rename edit mode
                            if (renamingIndex === i) {
                              return (
                                <div key={i} style={{ padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '10px', border: '2px solid #F59E0B', marginBottom: '8px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <span style={{ fontWeight: 'bold', color: '#92400E', fontSize: '13px' }}>✎ Rename File</span>
                                    <button
                                      onClick={() => { setRenamingIndex(null); setRenameValue(''); setRenameError(''); }}
                                      style={{ color: '#9CA3AF', fontSize: '12px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                                    >
                                      ✕ Cancel
                                    </button>
                                  </div>
                                  <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '10px', marginBottom: '12px', border: '1px solid #F59E0B' }}>
                                    <p style={{ fontWeight: '600', color: '#92400E', fontSize: '11px', marginBottom: '4px', marginTop: 0 }}>📋 Correct format:</p>
                                    <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#1A1A1A', margin: 0 }}>PAN_Year_Quarter_Type.pdf</p>
                                    <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '2px', marginBottom: 0 }}>Example: ABCDE1234F_2025-26_Q3_Form16.pdf</p>
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                    <input
                                      type="text"
                                      value={renameValue}
                                      onChange={(e) => { setRenameValue(e.target.value); setRenameError(''); }}
                                      placeholder="ABCDE1234F_2025-26_Q3_Form16.pdf"
                                      style={{
                                        flex: 1, border: renameError ? '1px solid #DC2626' : '1px solid #D1D5DB',
                                        borderRadius: '8px', padding: '8px 12px', fontSize: '13px',
                                        outline: 'none', fontFamily: 'monospace',
                                        backgroundColor: renameError ? '#FEF2F2' : 'white'
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        const filenameRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}_\d{4}-\d{2}_Q[1-4]_\w+\.pdf$/i;
                                        if (!renameValue.trim()) {
                                          setRenameError('Filename cannot be empty');
                                          return;
                                        }
                                        if (!filenameRegex.test(renameValue.trim())) {
                                          setRenameError('Invalid format. Use: PAN_Year_Quarter_Type.pdf (e.g. ABCDE1234F_2025-26_Q3_Form16.pdf)');
                                          return;
                                        }
                                        setRenamedFiles(prev => ({ ...prev, [i]: { newName: renameValue.trim(), valid: true } }));
                                        setRenamingIndex(null);
                                        setRenameValue('');
                                        setRenameError('');
                                      }}
                                      style={{ flexShrink: 0, backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                    >
                                      ✓ Apply
                                    </button>
                                  </div>
                                  {renameError && (
                                    <p style={{ color: '#DC2626', fontSize: '11px', marginTop: '6px', marginBottom: 0 }}>⚠ {renameError}</p>
                                  )}
                                </div>
                              );
                            }

                            // STATE 4 — successfully renamed
                            if (renamedFiles[i]) {
                              return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#F0FDF4', borderRadius: '10px', border: '1px solid #86EFAC', marginBottom: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FileText size={16} color="#166534" />
                                    <div>
                                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#166534', margin: 0 }}>{renamedFiles[i].newName}</p>
                                      <p style={{ fontSize: '10px', color: '#9CA3AF', textDecoration: 'line-through', marginTop: '1px', marginBottom: 0 }}>{f.name}</p>
                                      <p style={{ fontSize: '11px', color: '#9CA3AF', margin: 0 }}>{f.size}</p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #86EFAC', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>✓ Renamed & Valid</span>
                                    <button
                                      onClick={() => setRenamedFiles(prev => { const u = { ...prev }; delete u[i]; return u; })}
                                      style={{ border: '1px solid #D1D5DB', color: '#9CA3AF', backgroundColor: 'white', borderRadius: '6px', padding: '3px 8px', fontSize: '11px', cursor: 'pointer' }}
                                    >
                                      ↩ Undo
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            // STATE 1 — valid file
                            if (f.valid) {
                              return (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #F3F4F6', marginBottom: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <FileText size={16} color="#8B1A1A" />
                                    <div>
                                      <p style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A1A', margin: 0 }}>{f.name}</p>
                                      <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', marginBottom: 0 }}>{f.size}</p>
                                    </div>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ backgroundColor: '#F0FDF4', color: '#166534', border: '1px solid #86EFAC', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600' }}>✓ Valid</span>
                                    <button
                                      onClick={() => {}}
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px', display: 'flex', alignItems: 'center' }}
                                    >
                                      <X size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            // STATE 2 — invalid, not editing
                            return (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: '#FEF2F2', borderRadius: '10px', border: '1px solid #FCA5A5', marginBottom: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <FileText size={16} color="#DC2626" />
                                  <div>
                                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#DC2626', textDecoration: 'line-through', opacity: 0.7, margin: 0 }}>{f.name}</p>
                                    <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px', marginBottom: 0 }}>{f.size}</p>
                                    <p style={{ fontSize: '10px', color: '#DC2626', opacity: 0.7, marginTop: '2px', marginBottom: 0, fontStyle: 'italic' }}>Expected format: PAN_Year_Quarter_Type.pdf</p>
                                  </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>❌ Invalid filename</span>
                                  <button
                                    onClick={() => { setRenamingIndex(i); setRenameValue(f.name); setRenameError(''); }}
                                    style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}
                                  >
                                    ✎ Rename
                                  </button>
                                  <button
                                    onClick={() => {}}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px', display: 'flex', alignItems: 'center' }}
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* SUMMARY BAR */}
                        <div style={{ marginTop: '4px', backgroundColor: '#F9FAFB', borderRadius: '8px', padding: '12px 16px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ color: '#166534', fontWeight: '600', fontSize: '13px' }}>✓ {step2ValidCount} valid files ready</span>
                          {step2RejectedCount > 0 && (
                            <span style={{ color: '#DC2626', fontWeight: '600', fontSize: '13px' }}>❌ {step2RejectedCount} rejected</span>
                          )}
                          {totalRenamed > 0 && (
                            <span style={{ color: '#D97706', fontWeight: '500', fontSize: '13px' }}>✎ {totalRenamed} renamed</span>
                          )}
                          {step2RejectedCount > 0 && (
                            <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <AlertCircle size={13} /> Invalid filename format
                            </span>
                          )}
                        </div>

                        {/* BUTTONS */}
                        <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <button
                            onClick={() => setFileSelected(false)}
                            style={{ border: '1px solid #D1D5DB', color: '#6B7280', backgroundColor: 'white', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: '600' }}
                          >
                            ← Back
                          </button>
                          <div style={{ marginLeft: 'auto', textAlign: 'center' }}>
                            <button
                              onClick={() => {
                                setProcessingDone(false);
                                setStep(3);
                                setTimeout(() => setProcessingDone(true), 1500);
                              }}
                              style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '600', cursor: 'pointer' }}
                            >
                              Process Upload →
                            </button>
                            {allResolved ? (
                              <p style={{ fontSize: '12px', color: '#166534', textAlign: 'center', marginTop: '8px', marginBottom: 0 }}>
                                ✓ All files have valid filenames. Ready to process.
                              </p>
                            ) : (
                              <p style={{ fontSize: '12px', color: '#92400E', textAlign: 'center', marginTop: '8px', marginBottom: 0 }}>
                                ⚠ {step2RejectedCount} file(s) still have invalid filenames and will be excluded from mapping. You can fix them in Step 3.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3 — CONFIRM MAPPING */}
              {step === 3 && (
                <div>
                  {!processingDone ? (
                    <div style={{ textAlign: 'center', padding: '48px' }}>
                      <div style={{
                        width: '48px', height: '48px',
                        border: '4px solid #FDF0F0',
                        borderTop: '4px solid #8B1A1A',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                      }}/>
                      <p style={{ color: '#8B1A1A', fontWeight: '600', marginTop: '16px', marginBottom: 0 }}>Processing files...</p>
                      <p style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px', marginBottom: 0 }}>Extracting PAN numbers and mapping to investors</p>
                    </div>
                  ) : (
                    <div>
                      {/* FILTER CHIPS */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', color: '#6B7280', marginRight: '4px' }}>Show:</span>
                        {(['all', 'mapped', 'rejected'] as const).map(f => (
                          <button
                            key={f}
                            onClick={() => setMappingFilter(f)}
                            style={{
                              padding: '6px 14px',
                              borderRadius: '20px',
                              border: mappingFilter === f ? 'none' : '1px solid #D1D5DB',
                              backgroundColor: mappingFilter === f
                                ? f === 'rejected' ? '#FEF2F2' : f === 'mapped' ? '#F0FDF4' : '#8B1A1A'
                                : 'white',
                              color: mappingFilter === f
                                ? f === 'rejected' ? '#DC2626' : f === 'mapped' ? '#166534' : 'white'
                                : '#6B7280',
                              fontWeight: mappingFilter === f ? '600' : '400',
                              fontSize: '13px',
                              cursor: 'pointer'
                            }}
                          >
                            {f === 'all' ? `All (${allMappingRows.length})` : f === 'mapped' ? `✅ Mapped (${mappedCount})` : `❌ Rejected (${rejectedCount})`}
                          </button>
                        ))}
                      </div>

                      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                        <div style={{ backgroundColor: '#8B1A1A', color: 'white', padding: '16px' }}>
                          <h3 style={{ fontWeight: '600', margin: 0, fontSize: '16px' }}>Document Mapping Results</h3>
                          <p style={{ opacity: 0.8, fontSize: '13px', margin: '4px 0 0 0' }}>
                            {mappedCount} of {allMappingRows.length} files successfully mapped
                            {totalRemapped > 0 && ` (${totalRemapped} manually remapped)`}
                          </p>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ backgroundColor: '#FDF0F0' }}>
                              {['FILENAME', 'PAN EXTRACTED', 'INVESTOR NAME', 'STATUS', 'ACTION'].map(h => (
                                <th key={h} style={{ padding: '10px 16px', fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {filteredRows.map((row) => {
                              const rowIndex = row.index;
                              const remapped = remappedRows[rowIndex];
                              const isEditing = editingRow === rowIndex;

                              if (isEditing) {
                                return (
                                  <tr key={rowIndex} style={{ backgroundColor: '#FFFBEB' }}>
                                    <td colSpan={5} style={{ padding: '16px' }}>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ fontSize: '13px', color: '#6B7280' }}>File:</span>
                                          <span style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A1A' }}>{row.file}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                          <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>ENTER PAN MANUALLY</label>
                                            <input
                                              type="text"
                                              value={editPAN}
                                              onChange={(e) => {
                                                setEditPAN(e.target.value.toUpperCase());
                                                setEditError('');
                                              }}
                                              placeholder="e.g. ABCDE1234F"
                                              maxLength={10}
                                              style={{
                                                border: editError ? '1px solid #DC2626' : '1px solid #D1D5DB',
                                                borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
                                                width: '100%', outline: 'none', fontFamily: 'monospace',
                                                backgroundColor: editError ? '#FEF2F2' : 'white',
                                                boxSizing: 'border-box'
                                              }}
                                            />
                                            {editError && (
                                              <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>⚠ {editError}</p>
                                            )}
                                          </div>
                                          <div style={{ flex: 2 }}>
                                            <label style={{ fontSize: '11px', color: '#6B7280', fontWeight: '600', letterSpacing: '0.5px', marginBottom: '4px', display: 'block' }}>INVESTOR NAME</label>
                                            <div style={{
                                              border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px 12px',
                                              fontSize: '13px', backgroundColor: '#F9FAFB', color: investorLookup[editPAN] ? '#1A1A1A' : '#9CA3AF', minHeight: '42px'
                                            }}>
                                              {investorLookup[editPAN] || (editPAN.length === 10 ? '— No investor found for this PAN' : '— Enter a valid PAN to lookup')}
                                            </div>
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                          <button
                                            onClick={() => {
                                              const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                                              if (!panRegex.test(editPAN)) {
                                                setEditError('Invalid PAN format. Must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)');
                                                return;
                                              }
                                              if (!investorLookup[editPAN]) {
                                                setEditError('PAN not found in investor database. Please verify and try again.');
                                                return;
                                              }
                                              setRemappedRows(prev => ({
                                                ...prev,
                                                [rowIndex]: { pan: editPAN, investorName: investorLookup[editPAN], status: 'mapped' }
                                              }));
                                              setEditingRow(null);
                                              setEditPAN('');
                                              setEditError('');
                                            }}
                                            style={{ backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
                                          >
                                            ✓ Confirm Mapping
                                          </button>
                                          <button
                                            onClick={() => {
                                              setEditingRow(null);
                                              setEditPAN('');
                                              setEditError('');
                                            }}
                                            style={{ border: '1px solid #D1D5DB', color: '#6B7280', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              }

                              if (remapped) {
                                return (
                                  <tr key={rowIndex} style={{ backgroundColor: '#F0FDF4', borderBottom: '1px solid #DCFCE7' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{row.file}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace' }}>{remapped.pan}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500' }}>{remapped.investorName}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                      <span style={{ backgroundColor: '#DCFCE7', color: '#166534', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '600' }}>✅ Remapped</span>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                      <button
                                        onClick={() => {
                                          setRemappedRows(prev => {
                                            const next = { ...prev };
                                            delete next[rowIndex];
                                            return next;
                                          });
                                        }}
                                        style={{ color: '#6B7280', fontSize: '12px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', textDecoration: 'underline' }}
                                      >
                                        ↩ Undo
                                      </button>
                                    </td>
                                  </tr>
                                );
                              }

                              if (row.status === 'mapped') {
                                return (
                                  <tr key={rowIndex} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>{row.file}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace' }}>{row.pan}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '500' }}>{row.name}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                      <span style={{ backgroundColor: '#F0FDF4', color: '#166534', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: '600' }}>✅ Mapped</span>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#D1D5DB' }}>—</td>
                                  </tr>
                                );
                              }

                              // Rejected, not editing, not remapped
                              return (
                                <tr key={rowIndex} style={{ backgroundColor: '#FEF2F2', borderBottom: '1px solid #FEE2E2' }}>
                                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>{row.file}</td>
                                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#9CA3AF' }}>—</td>
                                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#9CA3AF' }}>—</td>
                                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                    <span style={{ color: '#DC2626', fontSize: '12px', fontWeight: '600' }}>❌ PAN not found</span>
                                  </td>
                                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                                    <button
                                      onClick={() => {
                                        setEditingRow(rowIndex);
                                        setEditPAN('');
                                        setEditError('');
                                      }}
                                      style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}
                                    >
                                      ✎ Fix
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 4px 0' }}>Total Uploaded</p>
                          <p style={{ fontWeight: 'bold', fontSize: '24px', color: '#1A1A1A', margin: 0 }}>{allMappingRows.length}</p>
                        </div>
                        <div style={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 4px 0' }}>Successfully Mapped</p>
                          <p style={{ fontWeight: 'bold', fontSize: '24px', color: '#166534', margin: 0 }}>{mappedCount}</p>
                        </div>
                        <div style={{ backgroundColor: rejectedCount > 0 ? '#FEF2F2' : 'white', border: `1px solid ${rejectedCount > 0 ? '#FEE2E2' : '#E5E7EB'}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                          <p style={{ color: '#6B7280', fontSize: '12px', margin: '0 0 4px 0' }}>Rejected</p>
                          <p style={{ fontWeight: 'bold', fontSize: '24px', color: rejectedCount > 0 ? '#DC2626' : '#166534', margin: 0 }}>{rejectedCount}</p>
                        </div>
                      </div>

                      {totalRemapped > 0 && (
                        <div style={{ marginTop: '12px', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '16px' }}>⚠️</span>
                          <span style={{ fontSize: '13px', color: '#92400E' }}>
                            <strong>{totalRemapped} document{totalRemapped > 1 ? 's' : ''}</strong> {totalRemapped > 1 ? 'were' : 'was'} manually remapped. Please verify the PAN assignments before confirming.
                          </span>
                        </div>
                      )}

                      <div style={{ marginTop: '16px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => {
                            setStep(2);
                            setFileSelected(true);
                            setProcessingDone(false);
                          }}
                          style={{ border: '1px solid #D1D5DB', color: '#6B7280', backgroundColor: 'white', borderRadius: '10px', padding: '12px 24px', cursor: 'pointer', fontWeight: '600' }}
                        >
                          ← Upload More
                        </button>
                        <button
                          onClick={() => {
                            setIsLoading(true);
                            setTimeout(() => {
                              setUploadSuccess(true);
                              setIsLoading(false);
                            }, 800);
                          }}
                          disabled={isLoading}
                          style={{ backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isLoading ? 0.7 : 1 }}
                        >
                          {isLoading ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              Saving...
                            </>
                          ) : totalRemapped > 0 ? (
                            <>✓ Confirm & Save ({mappedCount} documents)</>
                          ) : (
                            <>✓ Confirm & Save</>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2 — DOCUMENT LIBRARY */}
      {activeTab === 'library' && (
        <div>
          {/* FILTER + ACTION BAR */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <select style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}>
              <option>All FY</option>
              <option>FY 2025-26</option>
              <option>FY 2024-25</option>
            </select>
            <select style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}>
              <option>All Types</option>
              <option>Form 16</option>
              <option>Form 15CA-CB</option>
              <option>Form 64B</option>
              <option>Other</option>
            </select>
            <select style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none' }}>
              <option>All Quarters</option>
              <option>Q1</option><option>Q2</option><option>Q3</option><option>Q4</option>
            </select>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                placeholder="Search by PAN or Investor Name..."
                value={libSearch}
                onChange={(e) => setLibSearch(e.target.value)}
                style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px 8px 32px', fontSize: '13px', width: '200px', outline: 'none' }}
              />
            </div>
            
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '8px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setLibView('list')}
                  style={{ 
                    padding: '8px 12px', fontSize: '12px', cursor: 'pointer', border: 'none',
                    backgroundColor: libView === 'list' ? '#8B1A1A' : 'white',
                    color: libView === 'list' ? 'white' : '#6B7280',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  <List size={14} /> List
                </button>
                <button 
                  onClick={() => setLibView('folder')}
                  style={{ 
                    padding: '8px 12px', fontSize: '12px', cursor: 'pointer', border: 'none',
                    backgroundColor: libView === 'folder' ? '#8B1A1A' : 'white',
                    color: libView === 'folder' ? 'white' : '#6B7280',
                    display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                >
                  <Folder size={14} /> Folder
                </button>
              </div>
              <button onClick={handleExport} style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer', fontWeight: '600' }}>
                ↓ Bulk Download
              </button>
            </div>
          </div>

          {/* LIST VIEW */}
          {libView === 'list' && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#8B1A1A', color: 'white' }}>
                    {['PAN', 'INVESTOR NAME', 'DOCUMENT TYPE', 'FY', 'QUARTER', 'UPLOADED ON', 'UPLOADED BY', 'ACTION'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {libraryDocs.map((row, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#FDF0F0' : 'white' }}>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', fontFamily: 'monospace' }}>{row.pan}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6', fontWeight: '500' }}>{row.name}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.type}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.fy}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.q}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.date}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>{row.by}</td>
                      <td style={{ padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #F3F4F6' }}>
                        <button 
                          onClick={(e) => {
                            const btn = e.currentTarget;
                            const originalText = btn.innerHTML;
                            btn.innerHTML = 'Downloading...';
                            setTimeout(() => btn.innerHTML = originalText, 1000);
                            handleExport();
                          }}
                          style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          ↓ Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ backgroundColor: 'white', borderTop: '1px solid #E5E7EB', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6B7280', fontSize: '13px' }}>Showing 1–10 of 42 documents</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 10px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>← Prev</button>
                  <button style={{ backgroundColor: '#8B1A1A', color: 'white', borderRadius: '6px', padding: '6px 12px', border: 'none', fontWeight: 'bold' }}>1</button>
                  <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>2</button>
                  <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>3</button>
                  <span style={{ alignSelf: 'center', color: '#6B7280' }}>...</span>
                  <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 12px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>5</button>
                  <button style={{ border: '1px solid #D1D5DB', borderRadius: '6px', padding: '6px 10px', color: '#6B7280', cursor: 'pointer', backgroundColor: 'white' }}>Next →</button>
                </div>
              </div>
            </div>
          )}

          {/* FOLDER VIEW */}
          {libView === 'folder' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* FY 2025-26 FOLDER */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div 
                  onClick={() => toggleFolder('FY 2025-26')}
                  style={{ backgroundColor: '#FDF0F0', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Folder size={18} color="#8B1A1A" style={{ marginRight: '8px' }} />
                    <span style={{ fontWeight: 'bold', color: '#8B1A1A' }}>FY 2025-26</span>
                    <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '8px' }}>28 documents</span>
                  </div>
                  {expandedFolders.includes('FY 2025-26') ? <ChevronUp size={18} color="#8B1A1A" /> : <ChevronDown size={18} color="#8B1A1A" />}
                </div>

                {expandedFolders.includes('FY 2025-26') && (
                  <div>
                    {[
                      { type: 'Form 16', count: '12 files • Q3: 4, Q2: 4, Q1: 4' },
                      { type: 'Form 15CA-CB', count: '8 files • Q3: 4, Q2: 4' },
                      { type: 'Form 64B', count: '8 files • Q1: 8' },
                    ].map((sub, i) => (
                      <div key={i} style={{ borderTop: '1px solid #F3F4F6', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <FileText size={16} color="#6B7280" style={{ marginRight: '8px' }} />
                          <span style={{ fontWeight: '500', color: '#1A1A1A' }}>{sub.type}</span>
                          <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '8px' }}>{sub.count}</span>
                        </div>
                        <button 
                          onClick={handleExport}
                          style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          ↓ Download All
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* FY 2024-25 FOLDER */}
              <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <div 
                  onClick={() => toggleFolder('FY 2024-25')}
                  style={{ backgroundColor: '#FDF0F0', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Folder size={18} color="#8B1A1A" style={{ marginRight: '8px' }} />
                    <span style={{ fontWeight: 'bold', color: '#8B1A1A' }}>FY 2024-25</span>
                    <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '8px' }}>14 documents</span>
                  </div>
                  {expandedFolders.includes('FY 2024-25') ? <ChevronUp size={18} color="#8B1A1A" /> : <ChevronDown size={18} color="#8B1A1A" />}
                </div>

                {expandedFolders.includes('FY 2024-25') && (
                  <div>
                    {[
                      { type: 'Form 16', count: '8 files • Q4: 4, Q3: 4' },
                      { type: 'Form 15CA-CB', count: '6 files • Q2: 6' },
                    ].map((sub, i) => (
                      <div key={i} style={{ borderTop: '1px solid #F3F4F6', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <FileText size={16} color="#6B7280" style={{ marginRight: '8px' }} />
                          <span style={{ fontWeight: '500', color: '#1A1A1A' }}>{sub.type}</span>
                          <span style={{ color: '#6B7280', fontSize: '12px', marginLeft: '8px' }}>{sub.count}</span>
                        </div>
                        <button 
                          onClick={handleExport}
                          style={{ border: '1px solid #8B1A1A', color: '#8B1A1A', backgroundColor: 'white', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', cursor: 'pointer' }}
                        >
                          ↓ Download All
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

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

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </div>
  );
};
