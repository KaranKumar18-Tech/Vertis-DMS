import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useApprovals } from '../../context/ApprovalContext';

export const Layout = () => {
  const location = useLocation();
  const { pendingApprovals } = useApprovals();
  
  // Map paths to titles
  const getTitle = (path: string) => {
    const segment = path.split('/').pop() || '';
    return segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar pendingCount={pendingApprovals.length} />
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header title={getTitle(location.pathname)} />
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
