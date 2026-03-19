import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  IndianRupee, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Download,
  Calendar,
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Button } from '../../components/ui/Button';

const stats = [
  { 
    label: 'Total Unit Holders', 
    value: '1,248', 
    subtext: 'Active: 1,102 | Inactive: 146',
    icon: Users,
    color: 'bg-[#FDF0F0] text-[#8B1A1A]'
  },
  { 
    label: 'Current Quarter', 
    value: 'Q3 FY 2025-26', 
    subtext: 'Ongoing Period',
    icon: Calendar,
    color: 'bg-[#FDF0F0] text-[#8B1A1A]'
  },
  { 
    label: 'Last Distribution Processed', 
    value: 'Q2 FY 2025-26', 
    subtext: 'Status: Approved',
    icon: CheckCircle2,
    color: 'bg-[#FDF0F0] text-[#8B1A1A]'
  },
  { 
    label: 'Pending Approvals', 
    value: '3', 
    subtext: 'Action Required',
    icon: AlertCircle,
    color: 'bg-[#FDF0F0] text-[#8B1A1A]'
  },
];

const chartData = [
  { quarter: 'Q4 FY24-25', amount: 4200000 },
  { quarter: 'Q1 FY25-26', amount: 3800000 },
  { quarter: 'Q2 FY25-26', amount: 4500000 },
  { quarter: 'Q3 FY25-26', amount: 2100000 },
];

const recentActivity = [
  { action: 'BENPOS Uploaded', user: 'Ashish Ranjan', time: '2024-06-12 10:30 AM', status: 'Success' },
  { action: 'Distribution Processed', user: 'System', time: '2024-06-12 11:00 AM', status: 'Completed' },
  { action: 'Approval Granted', user: 'Manager User', time: '2024-06-12 02:15 PM', status: 'Approved' },
  { action: 'New User Added', user: 'Ashish Ranjan', time: '2024-06-11 04:45 PM', status: 'Success' },
  { action: 'Report Generated', user: 'Ashish Ranjan', time: '2024-06-11 09:20 AM', status: 'Success' },
];

export const Dashboard = () => {
  const navigate = useNavigate();
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'BENPOS', 'Distribution', 'Documents', 'Users', 'Login'];

  const allActivities = [
    { module: 'BENPOS', action: 'BENPOS Upload Submitted for Approval', time: '2 hrs ago', description: 'Q3 FY 2025-26 — 1,108 records processed', user: 'Ashish Ranjan', color: '#8B1A1A' },
    { module: 'Distribution', action: 'Distribution Master Submitted', time: '2 hrs ago', description: 'Q3 FY 2025-26 — Rate: 0.1250', user: 'Ashish Ranjan', color: '#1D4ED8' },
    { module: 'Approval', action: 'BENPOS Upload Approved', time: '3 hrs ago', description: 'Q3 FY 2025-26 approved by Rahul Sharma', user: 'Rahul Sharma', color: '#D97706' },
    { module: 'Documents', action: 'Bulk Documents Uploaded', time: '5 hrs ago', description: '4 Form 16 documents mapped for Q3', user: 'Ashish Ranjan', color: '#166534' },
    { module: 'Login', action: 'User Login', time: '5 hrs ago', description: 'Successful login from 192.168.1.10', user: 'Ashish Ranjan', color: '#6B7280' },
    { module: 'Distribution', action: 'Distribution Processing Started', time: '6 hrs ago', description: 'Q3 FY 2025-26 — 1,102 investors calculated', user: 'Ashish Ranjan', color: '#1D4ED8' },
    { module: 'Approval', action: 'Distribution Master Approved', time: '1 day ago', description: 'Q3 FY 2025-26 — Rate 0.1250 locked', user: 'Rahul Sharma', color: '#D97706' },
    { module: 'BENPOS', action: 'BENPOS Upload Validated', time: '1 day ago', description: '48 new, 1,054 modified, 3 rejected', user: 'Ashish Ranjan', color: '#8B1A1A' },
    { module: 'Documents', action: 'Investor Document Upload', time: '1 day ago', description: 'Registration Cert uploaded by Prasad Agents', user: 'investor1', color: '#166534' },
    { module: 'Login', action: 'User Login', time: '1 day ago', description: 'Successful login from 192.168.1.11', user: 'Rahul Sharma', color: '#6B7280' },
    { module: 'Approval', action: 'Distribution Processing Approved', time: '2 days ago', description: 'Q2 FY 2025-26 — Quarter locked', user: 'Rahul Sharma', color: '#D97706' },
    { module: 'Distribution', action: 'Distribution Processing Submitted', time: '2 days ago', description: 'Q2 — ₹49,437.50 total gross', user: 'Ashish Ranjan', color: '#1D4ED8' },
    { module: 'BENPOS', action: 'BENPOS Upload Rejected', time: '3 days ago', description: 'Rejected: data inconsistency in unit holdings', user: 'Rahul Sharma', color: '#8B1A1A' },
    { module: 'Documents', action: 'Bulk Documents Uploaded', time: '3 days ago', description: '12 Form 15CA-CB documents for Q2', user: 'Ashish Ranjan', color: '#166534' },
    { module: 'Approval', action: 'Distribution Master Approved', time: '4 days ago', description: 'Q2 FY 2025-26 approved', user: 'Rahul Sharma', color: '#D97706' },
    { module: 'BENPOS', action: 'BENPOS Re-upload Submitted', time: '4 days ago', description: 'Q2 correction upload — 1,101 records', user: 'Ashish Ranjan', color: '#8B1A1A' },
    { module: 'Login', action: 'Password Reset', time: '5 days ago', description: 'Password reset via OTP for admin.sys', user: 'System', color: '#6B7280' },
    { module: 'Distribution', action: 'Distribution Master Created', time: '5 days ago', description: 'Q2 FY 2025-26 — Rate: 0.1300', user: 'Ashish Ranjan', color: '#1D4ED8' },
    { module: 'Documents', action: 'New User Created', time: '6 days ago', description: 'investor4 account created', user: 'Ashish Ranjan', color: '#166534' },
    { module: 'Login', action: 'Failed Login Attempt', time: '7 days ago', description: '3 failed attempts — account locked', user: 'admin.sys', color: '#6B7280' },
  ];

  const filteredActivities = activeFilter === 'All' 
    ? allActivities 
    : allActivities.filter(a => a.module === activeFilter);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="relative overflow-hidden hover:shadow-md transition-shadow border-l-4 border-l-[#8B1A1A]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-bold text-[#8B1A1A] mt-1">{stat.value}</h3>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">{stat.subtext}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <Card title="Quarterly Distribution" subtitle="Distribution amounts for the last 4 quarters">
          <div className="h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="quarter" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} 
                  tickFormatter={(value) => `₹${value/1000000}M`} 
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`₹${(value/1000000).toFixed(2)}M`, 'Amount']}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#8B1A1A' : '#D4A0A0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card title="Recent Activity" subtitle="Latest audit logs and system actions">
          <Table headers={['Action', 'User', 'Date & Time', 'Status']}>
            {recentActivity.map((activity, i) => (
              <TableRow key={i}>
                <TableCell className="font-semibold text-slate-900 text-xs">{activity.action}</TableCell>
                <TableCell className="text-xs">{activity.user}</TableCell>
                <TableCell className="text-xs text-slate-500">{activity.time}</TableCell>
                <TableCell>
                  <Badge variant={
                    activity.status === 'Success' || activity.status === 'Completed' || activity.status === 'Approved' 
                      ? 'success' 
                      : 'neutral'
                  } className="text-[10px] px-2 py-0">
                    {activity.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </Table>
          <div className="mt-6 text-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[#8B1A1A] font-bold text-xs hover:bg-[#FDF0F0]"
              onClick={() => setShowActivityLog(true)}
            >
              View All Activity <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Activity Log Slide-over */}
      {showActivityLog && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/40 transition-opacity duration-300" 
            onClick={() => setShowActivityLog(false)}
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="w-[600px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header */}
              <div className="bg-[#8B1A1A] px-6 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Activity Log</h3>
                  <p className="text-white/70 text-sm">All recent system actions</p>
                </div>
                <button 
                  onClick={() => setShowActivityLog(false)}
                  className="text-white hover:bg-white/10 p-2 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Filter Row */}
              <div className="bg-[#FDF0F0] px-6 py-3 overflow-x-auto no-scrollbar">
                <div className="flex gap-2 whitespace-nowrap">
                  {filters.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-xs font-semibold transition-all",
                        activeFilter === filter
                          ? "bg-[#8B1A1A] text-white"
                          : "bg-white border border-gray-300 text-gray-600 hover:border-[#8B1A1A] hover:text-[#8B1A1A]"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity List */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <div className="space-y-8 relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[3.5px] top-2 bottom-2 w-[1px] bg-gray-200" />

                  {filteredActivities.map((activity, i) => (
                    <div key={i} className="relative pl-8">
                      {/* Dot */}
                      <div 
                        className="absolute left-0 top-1.5 w-2 h-2 rounded-full z-10"
                        style={{ backgroundColor: activity.color }}
                      />
                      
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-bold text-[#1A1A1A] pr-4">{activity.action}</h4>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{activity.time}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-1">
                        <span 
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: `${activity.color}15`, color: activity.color }}
                        >
                          {activity.module}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      <p className="text-[10px] text-gray-400 mt-1">by {activity.user}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex flex-col items-center gap-3">
                <p className="text-gray-500 text-sm">Showing {filteredActivities.length} of 4,832 total activities</p>
                <button 
                  onClick={() => {
                    setShowActivityLog(false);
                    navigate('/admin/audit-log');
                  }}
                  className="text-[#8B1A1A] font-bold text-sm hover:underline flex items-center gap-1"
                >
                  View Full Audit Log <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper components for icons used in Quick Actions
const Upload = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const Cpu = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>;
const FileText = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>;
