import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { ApprovalProvider } from './context/ApprovalContext';

// Admin Pages
import { Login } from './pages/admin/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { BenposUpload } from './pages/admin/BenposUpload';
import { DistributionMaster } from './pages/admin/DistributionMaster';
import { DistributionProcessing } from './pages/admin/DistributionProcessing';
import { ApprovalQueue } from './pages/admin/ApprovalQueue';
import { Reports } from './pages/admin/Reports';
import { DocumentManagement } from './pages/admin/DocumentManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { AuditLog } from './pages/admin/AuditLog';
import { InvestorMobile } from './pages/admin/InvestorMobile';

// Investor Pages
import { InvestorLogin } from './pages/investor/InvestorLogin';

export default function App() {
  return (
    <ApprovalProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Redirect */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/investor-preview" element={<InvestorMobile />} />
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/benpos-upload" element={<BenposUpload />} />
            <Route path="/admin/distribution-master" element={<DistributionMaster />} />
            <Route path="/admin/processing" element={<DistributionProcessing />} />
            <Route path="/admin/approvals" element={<ApprovalQueue />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/documents" element={<DocumentManagement />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/audit-log" element={<AuditLog />} />
          </Route>

          {/* Investor Routes */}
          <Route path="/investor/login" element={<InvestorLogin />} />
        </Routes>
      </BrowserRouter>
    </ApprovalProvider>
  );
}
