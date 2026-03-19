export const DUMMY_DATA = {
  stats: [
    { label: 'Total Shareholders', value: '12,450', change: '+2.5%', trend: 'up' },
    { label: 'Total Distribution', value: '₹45.2 Cr', change: '+12%', trend: 'up' },
    { label: 'Pending Approvals', value: '24', change: '-5', trend: 'down' },
    { label: 'Processing Batches', value: '3', change: 'Active', trend: 'neutral' },
  ],
  distributionTrends: [
    { month: 'Jan', amount: 4000000 },
    { month: 'Feb', amount: 3000000 },
    { month: 'Mar', amount: 2000000 },
    { month: 'Apr', amount: 2780000 },
    { month: 'May', amount: 1890000 },
    { month: 'Jun', amount: 2390000 },
    { month: 'Jul', amount: 3490000 },
  ],
  recentBatches: [
    { id: 'B-2024-001', name: 'Q1 Dividend 2024', date: '2024-03-15', status: 'Completed', amount: '₹12.5 Cr' },
    { id: 'B-2024-002', name: 'Interim Distribution', date: '2024-05-20', status: 'Processing', amount: '₹8.2 Cr' },
    { id: 'B-2024-003', name: 'Special Dividend', date: '2024-06-10', status: 'Draft', amount: '₹5.0 Cr' },
  ],
  shareholders: [
    { id: 'SH-001', name: 'Amit Sharma', folio: 'F100234', holdings: '5,000', bank: 'HDFC Bank', status: 'Verified' },
    { id: 'SH-002', name: 'Priya Patel', folio: 'F100235', holdings: '2,500', bank: 'ICICI Bank', status: 'Verified' },
    { id: 'SH-003', name: 'Rajesh Kumar', folio: 'F100236', holdings: '10,000', bank: 'SBI', status: 'Pending' },
    { id: 'SH-004', name: 'Sneha Gupta', folio: 'F100237', holdings: '1,200', bank: 'Axis Bank', status: 'Verified' },
  ],
  auditLogs: [
    { id: 1, user: 'Admin User', action: 'Uploaded Benpos', timestamp: '2024-06-12 10:30 AM', ip: '192.168.1.1' },
    { id: 2, user: 'System', action: 'Batch Processing Started', timestamp: '2024-06-12 11:00 AM', ip: '-' },
    { id: 3, user: 'Manager User', action: 'Approved Distribution', timestamp: '2024-06-12 02:15 PM', ip: '192.168.1.5' },
  ],
  investorDocs: [
    { id: 1, name: 'Q1 Dividend Statement 2024', type: 'PDF', date: '2024-04-01', size: '1.2 MB' },
    { id: 2, name: 'Tax Deduction Certificate (Form 16A)', type: 'PDF', date: '2024-05-15', size: '450 KB' },
    { id: 3, name: 'Annual Report 2023-24', type: 'PDF', date: '2024-06-01', size: '5.4 MB' },
  ]
};
