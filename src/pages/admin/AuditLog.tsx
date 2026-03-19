import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Clock, 
  User, 
  Monitor, 
  Globe, 
  Activity,
  AlertCircle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  email: string;
  module: 'BENPOS' | 'Distribution' | 'Approval' | 'Documents' | 'Users' | 'Login' | 'System';
  action: string;
  ip: string;
  status: 'Success' | 'Failed' | 'Pending';
  details: string;
  avatarBg: string;
}

const AUDIT_DATA: AuditEntry[] = [
  { id: 1, timestamp: '02 Mar 2026 02:45 PM', user: 'Rahul Sharma', email: 'rahul.sharma@vertis.co.in', module: 'Distribution', action: 'Distribution Processing Submitted', ip: '192.168.1.2', status: 'Success', details: 'Q3 FY 2025-26, 1,102 investors', avatarBg: '#1D4ED8' },
  { id: 2, timestamp: '02 Mar 2026 11:15 AM', user: 'Rahul Sharma', email: 'rahul.sharma@vertis.co.in', module: 'Distribution', action: 'Distribution Master Submitted', ip: '192.168.1.2', status: 'Success', details: 'Rate 0.1250, Q3 FY 2025-26', avatarBg: '#1D4ED8' },
  { id: 3, timestamp: '02 Mar 2026 10:32 AM', user: 'Rahul Sharma', email: 'rahul.sharma@vertis.co.in', module: 'BENPOS', action: 'BENPOS Upload Submitted', ip: '192.168.1.2', status: 'Success', details: '1,108 records, Q3 FY 2025-26', avatarBg: '#1D4ED8' },
  { id: 4, timestamp: '02 Mar 2026 09:15 AM', user: 'Ashish Ranjan', email: 'ashish.ranjan@vertis.co.in', module: 'Login', action: 'Admin Login', ip: '192.168.1.1', status: 'Success', details: 'Chrome 122 / macOS', avatarBg: '#8B1A1A' },
  { id: 5, timestamp: '02 Mar 2026 09:10 AM', user: 'Rahul Sharma', email: 'rahul.sharma@vertis.co.in', module: 'Login', action: 'Admin Login', ip: '192.168.1.2', status: 'Success', details: 'Chrome 120 / Windows', avatarBg: '#1D4ED8' },
  { id: 6, timestamp: '01 Mar 2026 04:30 PM', user: 'Ashish Ranjan', email: 'ashish.ranjan@vertis.co.in', module: 'Documents', action: 'Bulk Document Upload', ip: '192.168.1.1', status: 'Success', details: '4 files uploaded, Form 16 Q3', avatarBg: '#8B1A1A' },
  { id: 7, timestamp: '01 Mar 2026 03:15 PM', user: 'Ashish Ranjan', email: 'ashish.ranjan@vertis.co.in', module: 'Approval', action: 'BENPOS Upload Approved', ip: '192.168.1.1', status: 'Success', details: 'Q3 FY 2025-26, Ashish Ranjan', avatarBg: '#8B1A1A' },
  { id: 8, timestamp: '01 Mar 2026 02:45 PM', user: 'Ashish Ranjan', email: 'ashish.ranjan@vertis.co.in', module: 'Approval', action: 'Distribution Master Approved', ip: '192.168.1.1', status: 'Success', details: 'Q2 FY 2025-26', avatarBg: '#8B1A1A' },
  { id: 9, timestamp: '28 Feb 2026 04:15 PM', user: 'Priya Mehta', email: 'priya.mehta@vertis.co.in', module: 'Login', action: 'Admin Login', ip: '192.168.1.3', status: 'Success', details: 'Safari / macOS', avatarBg: '#166534' },
  { id: 10, timestamp: '28 Feb 2026 11:30 AM', user: 'Rahul Sharma', email: 'rahul.sharma@vertis.co.in', module: 'BENPOS', action: 'BENPOS Upload Failed', ip: '192.168.1.2', status: 'Failed', details: 'Invalid file format — rejected', avatarBg: '#1D4ED8' },
  { id: 11, timestamp: '28 Feb 2026 10:00 AM', user: 'Vikram Nair', email: 'vikram.nair@vertis.co.in', module: 'Login', action: 'Admin Login', ip: '192.168.1.4', status: 'Success', details: 'Chrome 122 / Windows', avatarBg: '#D97706' },
  { id: 12, timestamp: '25 Feb 2026 03:30 PM', user: 'Ashish Ranjan', email: 'ashish.ranjan@vertis.co.in', module: 'Users', action: 'New User Created', ip: '192.168.1.1', status: 'Success', details: 'Vikram Nair added as Maker', avatarBg: '#8B1A1A' },
  { id: 13, timestamp: '20 Feb 2026 11:00 AM', user: 'Rahul Sharma', email: 'rahul.sharma@vertis.co.in', module: 'Distribution', action: 'Distribution Processing Submitted', ip: '192.168.1.2', status: 'Success', details: 'Q2 FY 2025-26', avatarBg: '#1D4ED8' },
  { id: 14, timestamp: '15 Feb 2026 09:45 AM', user: 'Ashish Ranjan', email: 'ashish.ranjan@vertis.co.in', module: 'Approval', action: 'Distribution Processing Approved', ip: '192.168.1.1', status: 'Success', details: 'Q2 FY 2025-26, ₹49,437.50', avatarBg: '#8B1A1A' },
  { id: 15, timestamp: '10 Feb 2026 02:15 PM', user: 'System', email: 'system@vertis.co.in', module: 'System', action: 'Scheduled Backup Completed', ip: '—', status: 'Success', details: 'Full database backup', avatarBg: '#0891B2' },
  { id: 16, timestamp: '05 Feb 2026 10:30 AM', user: 'Rahul Sharma', email: 'rahul.sharma@vertis.co.in', module: 'Login', action: 'Login Failed', ip: '192.168.1.2', status: 'Failed', details: 'Invalid password attempt (1/3)', avatarBg: '#1D4ED8' },
  { id: 17, timestamp: '03 Feb 2026 04:00 PM', user: 'Ashish Ranjan', email: 'ashish.ranjan@vertis.co.in', module: 'Users', action: 'User Role Modified', ip: '192.168.1.1', status: 'Success', details: 'Sneha Kapoor: Maker → Viewer', avatarBg: '#8B1A1A' },
  { id: 18, timestamp: '01 Feb 2026 09:00 AM', user: 'System', email: 'system@vertis.co.in', module: 'System', action: 'System Health Check', ip: '—', status: 'Success', details: 'All services operational', avatarBg: '#0891B2' },
  { id: 19, timestamp: '25 Jan 2026 03:15 PM', user: 'Ashish Ranjan', email: 'ashish.ranjan@vertis.co.in', module: 'Documents', action: 'Bulk Document Upload', ip: '192.168.1.1', status: 'Success', details: '8 files uploaded, Form 15CA-CB Q2', avatarBg: '#8B1A1A' },
  { id: 20, timestamp: '20 Jan 2026 11:30 AM', user: 'Rahul Sharma', email: 'rahul.sharma@vertis.co.in', module: 'BENPOS', action: 'BENPOS Upload Submitted', ip: '192.168.1.2', status: 'Success', details: '1,105 records, Q2 FY 2025-26', avatarBg: '#1D4ED8' }
];

export const AuditLog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All Modules');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [dateFilter, setDateFilter] = useState('All Time');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const getModuleColor = (module: AuditEntry['module']) => {
    switch (module) {
      case 'BENPOS': return '#8B1A1A';
      case 'Distribution': return '#1D4ED8';
      case 'Approval': return '#D97706';
      case 'Documents': return '#166534';
      case 'Users': return '#7C3AED';
      case 'Login': return '#6B7280';
      case 'System': return '#0891B2';
      default: return '#6B7280';
    }
  };

  const getStatusBadgeStyle = (status: AuditEntry['status']) => {
    switch (status) {
      case 'Success': return { bg: '#F0FDF4', color: '#166534' };
      case 'Failed': return { bg: '#FEF2F2', color: '#DC2626' };
      case 'Pending': return { bg: '#FEF3C7', color: '#92400E' };
    }
  };

  const filteredData = AUDIT_DATA.filter(entry => {
    const matchesSearch = entry.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'All Modules' || entry.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  return (
    <div style={{ padding: '24px' }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '24px', margin: 0 }}>Audit Log</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>Complete immutable history of all system actions</p>
        </div>
        <div style={{
          backgroundColor: '#FDF0F0', border: '1px solid #D4A0A0', borderRadius: '8px',
          padding: '6px 12px', fontSize: '12px', color: '#8B1A1A', fontWeight: '500',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <Lock size={14} /> 🔒 Read-only — Cannot be modified
        </div>
      </div>

      {/* SUMMARY STATS */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total Actions', value: '4,832', color: '#8B1A1A' },
          { label: 'Today', value: '18', color: '#1D4ED8' },
          { label: 'This Week', value: '147', color: '#166534' },
          { label: 'Failed', value: '3', color: '#DC2626' }
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${stat.color}`
          }}>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: '500' }}>{stat.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px',
        display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by user, action, or module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px',
              padding: '8px 12px 8px 40px', fontSize: '13px', outline: 'none'
            }}
          />
        </div>
        <select 
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }}
        >
          <option>All Modules</option>
          <option>BENPOS</option>
          <option>Distribution</option>
          <option>Approval</option>
          <option>Documents</option>
          <option>Users</option>
          <option>Login</option>
          <option>System</option>
        </select>
        <select 
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }}
        >
          <option>All Actions</option>
          <option>Created</option>
          <option>Submitted</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>Uploaded</option>
          <option>Logged In</option>
          <option>Modified</option>
        </select>
        <select 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px', fontSize: '13px', outline: 'none', backgroundColor: 'white' }}
        >
          <option>All Time</option>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
        <button style={{
          marginLeft: 'auto', border: '1px solid #8B1A1A', color: '#8B1A1A',
          backgroundColor: 'white', borderRadius: '8px', padding: '8px 16px',
          fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Download size={16} /> Export Log
        </button>
      </div>

      {/* TABLE */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#8B1A1A', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Timestamp</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>User</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Module</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Action</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>IP Address</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((entry, i) => (
              <React.Fragment key={entry.id}>
                <tr 
                  onClick={() => setExpandedRow(expandedRow === entry.id ? null : entry.id)}
                  style={{ 
                    backgroundColor: i % 2 !== 0 ? '#FDF0F0' : 'white',
                    borderBottom: '1px solid #F3F4F6',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} /> {entry.timestamp}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        backgroundColor: entry.avatarBg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '10px'
                      }}>
                        {entry.user === 'System' ? 'S' : entry.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: '#1A1A1A' }}>{entry.user}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#1A1A1A' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: getModuleColor(entry.module) }} />
                      {entry.module}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1A1A1A' }}>{entry.action}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280' }}>{entry.ip}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      backgroundColor: getStatusBadgeStyle(entry.status).bg,
                      color: getStatusBadgeStyle(entry.status).color,
                      borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '500'
                    }}>
                      {entry.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button 
                      style={{ border: 'none', background: 'none', color: '#8B1A1A', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      View Details {expandedRow === entry.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </td>
                </tr>
                {expandedRow === entry.id && (
                  <tr style={{ backgroundColor: '#FFFBF0', borderLeft: '4px solid #D97706' }}>
                    <td colSpan={7} style={{ padding: '16px 20px 16px 50px' }}>
                      <p style={{ fontWeight: 'bold', color: '#1A1A1A', fontSize: '14px', margin: '0 0 12px 0' }}>Action Details</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                        <div>
                          <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Performed by:</p>
                          <p style={{ fontSize: '13px', color: '#1A1A1A', margin: 0, fontWeight: '500' }}>{entry.user} ({entry.email})</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 4px 0', textTransform: 'uppercase' }}>IP Address:</p>
                          <p style={{ fontSize: '13px', color: '#1A1A1A', margin: 0, fontWeight: '500' }}>{entry.ip}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Session ID:</p>
                          <p style={{ fontSize: '13px', color: '#1A1A1A', margin: 0, fontWeight: '500' }}>SES-{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Browser:</p>
                          <p style={{ fontSize: '13px', color: '#1A1A1A', margin: 0, fontWeight: '500' }}>Chrome 122 / macOS</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Changes:</p>
                          <p style={{ fontSize: '13px', color: '#1A1A1A', margin: 0, fontWeight: '500' }}>{entry.details}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', color: '#6B7280', margin: '0 0 4px 0', textTransform: 'uppercase' }}>Timestamp:</p>
                          <p style={{ fontSize: '13px', color: '#1A1A1A', margin: 0, fontWeight: '500' }}>{entry.timestamp}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      <div style={{
        backgroundColor: 'white', borderTop: '1px solid #F3F4F6', padding: '16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <p style={{ color: '#6B7280', fontSize: '13px', margin: 0 }}>Showing 1–20 of 4,832 total audit records</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8B1A1A', fontSize: '12px', fontWeight: '500' }}>
          <Lock size={12} /> Audit records cannot be deleted or modified
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ border: '1px solid #D1D5DB', backgroundColor: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}>← Prev</button>
          <button style={{ backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold' }}>1</button>
          <button style={{ border: '1px solid #D1D5DB', backgroundColor: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}>2</button>
          <button style={{ border: 'none', backgroundColor: 'transparent', padding: '6px 8px', fontSize: '13px' }}>...</button>
          <button style={{ border: '1px solid #D1D5DB', backgroundColor: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}>242</button>
          <button style={{ border: '1px solid #D1D5DB', backgroundColor: 'white', borderRadius: '6px', padding: '6px 12px', fontSize: '13px', cursor: 'pointer' }}>Next →</button>
        </div>
      </div>
    </div>
  );
};
