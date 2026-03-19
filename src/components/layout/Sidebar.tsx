import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Upload, 
  Database, 
  Cpu, 
  CheckSquare, 
  BarChart3, 
  FileText, 
  Users, 
  History,
  LogOut
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Upload, label: 'BENPOS Master', path: '/admin/benpos-upload' },
  { icon: Database, label: 'Distribution Master', path: '/admin/distribution-master' },
  { icon: Cpu, label: 'Distribution Processing', path: '/admin/processing' },
  { icon: CheckSquare, label: 'Approval Queue', path: '/admin/approvals' },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  { icon: FileText, label: 'Document Management', path: '/admin/documents' },
  { icon: Users, label: 'User Management', path: '/admin/users' },
  { icon: History, label: 'Audit Log', path: '/admin/audit-log' },
];

export const Sidebar = ({ pendingCount = 0 }: { pendingCount?: number }) => {
  return (
    <aside className="w-64 h-screen bg-[#8B1A1A] border-r border-white/10 flex flex-col fixed left-0 top-0 z-40 text-white">
      <div className="p-0">
        <div style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          marginBottom: '8px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderRadius: '12px',
          margin: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '64px'
        }}>
          <img 
            src="https://i.postimg.cc/tgd6PLdh/image.png"
            alt="Vertis Infrastructure Trust"
            style={{
              height: '44px',
              width: 'auto',
              objectFit: 'contain',
              display: 'block'
            }}
            onError={(e: any) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <span style={{
              color: '#8B1A1A',
              fontWeight: 'bold',
              fontSize: '14px',
              letterSpacing: '1px'
            }}>VERTIS</span>
            <span style={{
              color: '#8B1A1A',
              fontSize: '9px',
              letterSpacing: '0.5px'
            }}>INFRASTRUCTURE TRUST</span>
          </div>
        </div>

        <nav className="space-y-1 px-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                isActive 
                  ? "bg-white/15 text-white border-l-4 border-white" 
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
              {item.path === '/admin/approvals' && pendingCount > 0 && (
                <span className="bg-white text-[#8B1A1A] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-white/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-white">AD</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">Admin User</p>
            <p className="text-xs text-white/70 truncate">admin@vertis.co.in</p>
          </div>
        </div>
        <NavLink to="/admin/login" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
          <LogOut className="h-4 w-4" />
          Logout
        </NavLink>
        <div className="mt-4 text-center">
          <p className="text-[10px] text-white/50">© Vertis Infrastructure Trust</p>
        </div>
      </div>
    </aside>
  );
};
