import React, { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  Edit2, 
  UserX, 
  UserCheck, 
  X, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Info
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Super Admin' | 'Maker' | 'Checker' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
  createdOn: string;
  avatarBg: string;
}

const INITIAL_USERS: User[] = [
  { 
    id: 1, 
    name: 'Ashish Ranjan', 
    email: 'ashish.ranjan@vertis.co.in', 
    role: 'Super Admin', 
    status: 'Active', 
    lastLogin: '02 Mar 2026, 09:15 AM', 
    createdOn: '01 Jan 2025',
    avatarBg: '#8B1A1A'
  },
  { 
    id: 2, 
    name: 'Rahul Sharma', 
    email: 'rahul.sharma@vertis.co.in', 
    role: 'Maker', 
    status: 'Active', 
    lastLogin: '02 Mar 2026, 10:32 AM', 
    createdOn: '15 Jan 2025',
    avatarBg: '#1D4ED8'
  },
  { 
    id: 3, 
    name: 'Priya Mehta', 
    email: 'priya.mehta@vertis.co.in', 
    role: 'Checker', 
    status: 'Active', 
    lastLogin: '28 Feb 2026, 04:15 PM', 
    createdOn: '15 Jan 2025',
    avatarBg: '#166534'
  },
  { 
    id: 4, 
    name: 'Vikram Nair', 
    email: 'vikram.nair@vertis.co.in', 
    role: 'Maker', 
    status: 'Active', 
    lastLogin: '25 Feb 2026, 11:00 AM', 
    createdOn: '01 Mar 2025',
    avatarBg: '#D97706'
  },
  { 
    id: 5, 
    name: 'Sneha Kapoor', 
    email: 'sneha.kapoor@vertis.co.in', 
    role: 'Viewer', 
    status: 'Inactive', 
    lastLogin: '10 Jan 2026, 02:30 PM', 
    createdOn: '01 Jun 2025',
    avatarBg: '#6B7280'
  }
];

export const UserManagement = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; title: string; message: string } | null>(null);

  // Form states for Add/Edit
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Maker' as User['role'],
    mobile: '',
    status: 'Active' as User['status']
  });

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (id: number) => {
    if (id === 1) return; // Prevent deactivating self
    
    setUsers(prev => prev.map(user => {
      if (user.id === id) {
        const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
        setToast({
          type: newStatus === 'Active' ? 'success' : 'error',
          title: `User ${newStatus === 'Active' ? 'Activated' : 'Deactivated'}`,
          message: `${user.name}'s account has been ${newStatus.toLowerCase()}.`
        });
        return { ...user, status: newStatus };
      }
      return user;
    }));
  };

  const validateUserForm = (isEdit = false) => {
    const errors: Record<string, string> = {};
    const existingEmails = [
      'ashish.ranjan@vertis.co.in',
      'rahul.sharma@vertis.co.in',
      'priya.mehta@vertis.co.in',
      'vikram.nair@vertis.co.in',
      'sneha.kapoor@vertis.co.in'
    ];

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    } else if (/\d/.test(formData.name)) {
      errors.name = "Name cannot contain numbers";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    } else if (!formData.email.endsWith('@vertis.co.in')) {
      errors.email = "Email must be a @vertis.co.in address";
    } else {
      const isDuplicate = existingEmails.includes(formData.email.toLowerCase()) || 
                         users.some(u => u.email.toLowerCase() === formData.email.toLowerCase() && (!isEdit || u.id !== selectedUser?.id));
      if (isDuplicate) {
        errors.email = isEdit ? "This email is already in use by another user" : "This email is already registered in the system";
      }
    }

    // Role validation
    if (!formData.role) {
      errors.role = "Please select a role for this user";
    }

    // Mobile validation
    if (formData.mobile.trim()) {
      const mobileRegex = /^[6-9]\d{9}$/;
      // Remove spaces/hyphens for check
      const cleanMobile = formData.mobile.replace(/[\s-]/g, '');
      if (!mobileRegex.test(cleanMobile)) {
        errors.mobile = "Please enter a valid 10-digit mobile number";
      }
    }

    return errors;
  };

  const handleAddUser = () => {
    const errors = validateUserForm();
    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    setUserFormErrors({});
    setIsLoading(true);

    setTimeout(() => {
      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: 'Active',
        lastLogin: 'Never',
        createdOn: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        avatarBg: ['#8B1A1A', '#1D4ED8', '#166534', '#D97706', '#7C3AED'][Math.floor(Math.random() * 5)]
      };
      setUsers(prev => [...prev, newUser]);
      setIsLoading(false);
      setShowAddModal(false);
      setFormData({ name: '', email: '', role: 'Maker', mobile: '', status: 'Active' });
      setToast({
        type: 'success',
        title: 'User Created',
        message: 'New user added and credentials sent.'
      });
    }, 800);
  };

  const handleEditUser = () => {
    if (!selectedUser) return;
    
    const errors = validateUserForm(true);
    if (Object.keys(errors).length > 0) {
      setUserFormErrors(errors);
      return;
    }

    setUserFormErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, name: formData.name, email: formData.email, role: formData.role, status: formData.status }
          : user
      ));
      setIsLoading(false);
      setShowEditModal(false);
      setSelectedUser(null);
      setToast({
        type: 'success',
        title: 'User Updated',
        message: 'User details have been updated successfully.'
      });
    }, 800);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      mobile: '',
      status: user.status
    });
    setShowEditModal(true);
  };

  const getRoleBadgeStyle = (role: User['role']) => {
    switch (role) {
      case 'Super Admin': return { bg: '#FDF0F0', color: '#8B1A1A' };
      case 'Maker': return { bg: '#EFF6FF', color: '#1D4ED8' };
      case 'Checker': return { bg: '#F0FDF4', color: '#166534' };
      case 'Viewer': return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    inactive: users.filter(u => u.status === 'Inactive').length
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', right: '24px', zIndex: 100,
          backgroundColor: 'white', borderRadius: '12px', padding: '16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', borderLeft: `6px solid ${toast.type === 'success' ? '#166534' : '#DC2626'}`,
          display: 'flex', alignItems: 'center', gap: '12px', minWidth: '320px',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {toast.type === 'success' ? <CheckCircle color="#166534" size={24} /> : <AlertCircle color="#DC2626" size={24} />}
          <div>
            <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#1A1A1A', margin: 0 }}>{toast.title}</p>
            <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>{toast.message}</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ color: '#8B1A1A', fontWeight: 'bold', fontSize: '24px', margin: 0 }}>User Management</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>Manage portal access and role permissions</p>
        </div>
        <button 
          onClick={() => {
            setFormData({ name: '', email: '', role: 'Maker', mobile: '', status: 'Active' });
            setShowAddModal(true);
          }}
          style={{
            backgroundColor: '#8B1A1A', color: 'white', border: 'none',
            borderRadius: '10px', padding: '10px 20px', fontWeight: '600',
            fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total Users', value: stats.total, color: '#8B1A1A' },
          { label: 'Active', value: stats.active, color: '#166534' },
          { label: 'Inactive', value: stats.inactive, color: '#DC2626' }
        ].map((stat, i) => (
          <div key={i} style={{
            flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: `4px solid ${stat.color}`
          }}>
            <p style={{ fontSize: '12px', color: '#6B7280', marginBottom: '4px', fontWeight: '500' }}>{stat.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color, margin: 0 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* SEARCH + FILTER */}
      <div style={{
        backgroundColor: 'white', borderRadius: '12px', padding: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '16px',
        display: 'flex', gap: '12px', alignItems: 'center'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px',
              padding: '8px 12px 8px 40px', fontSize: '13px', outline: 'none'
            }}
          />
        </div>
        <select 
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            border: '1px solid #D1D5DB', borderRadius: '8px', padding: '8px 12px',
            fontSize: '13px', outline: 'none', backgroundColor: 'white'
          }}
        >
          <option>All Roles</option>
          <option>Super Admin</option>
          <option>Maker</option>
          <option>Checker</option>
          <option>Viewer</option>
        </select>
      </div>

      {/* TABLE */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#8B1A1A', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>User</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Last Login</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Created On</th>
              <th style={{ padding: '14px 16px', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((user, i) => (
              <tr key={user.id} style={{ 
                backgroundColor: i % 2 !== 0 ? '#FDF0F0' : 'white',
                borderBottom: '1px solid #F3F4F6'
              }}>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      backgroundColor: user.avatarBg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '13px'
                    }}>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1A1A1A', fontSize: '14px', margin: 0 }}>{user.name}</p>
                      <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '1px', margin: 0 }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    backgroundColor: getRoleBadgeStyle(user.role).bg,
                    color: getRoleBadgeStyle(user.role).color,
                    borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: '500'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    backgroundColor: user.status === 'Active' ? '#F0FDF4' : '#F3F4F6',
                    color: user.status === 'Active' ? '#166534' : '#6B7280',
                    borderRadius: '20px', padding: '3px 10px', fontSize: '12px',
                    display: 'flex', alignItems: 'center', gap: '6px', width: 'fit-content'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: user.status === 'Active' ? '#166534' : '#6B7280' }} />
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#1A1A1A' }}>{user.lastLogin}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#6B7280' }}>{user.createdOn}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => openEditModal(user)}
                      style={{
                        border: '1px solid #D1D5DB', color: '#374151', backgroundColor: 'white',
                        borderRadius: '6px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <Edit2 size={14} /> Edit
                    </button>
                    {user.id !== 1 ? (
                      <button 
                        onClick={() => handleToggleStatus(user.id)}
                        style={{
                          border: `1px solid ${user.status === 'Active' ? '#FCA5A5' : '#86EFAC'}`,
                          color: user.status === 'Active' ? '#DC2626' : '#166534',
                          backgroundColor: 'white', borderRadius: '6px', padding: '6px 10px',
                          fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px'
                        }}
                      >
                        {user.status === 'Active' ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Activate</>}
                      </button>
                    ) : (
                      <span style={{ color: '#9CA3AF', fontSize: '12px', padding: '6px 10px' }}>—</span>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
          justifyContent: 'center', alignItems: 'flex-start', paddingTop: '80px'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px',
            padding: '32px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }}>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ fontWeight: 'bold', fontSize: '20px', color: '#1A1A1A', margin: 0 }}>Add New User</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              {Object.keys(userFormErrors).length > 0 && (
                <div style={{
                  backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
                  borderRadius: '10px', padding: '12px', mb: '16px',
                  fontSize: '13px', color: '#DC2626'
                }}>
                  Please fix {Object.keys(userFormErrors).length} error(s) before submitting.
                </div>
              )}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. Ankit Sharma"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (userFormErrors.name) {
                      const newErrors = { ...userFormErrors };
                      delete newErrors.name;
                      setUserFormErrors(newErrors);
                    }
                  }}
                  style={{ 
                    width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none',
                    ...(userFormErrors.name ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : formData.name ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                  }}
                />
                {userFormErrors.name && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠ {userFormErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Email <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input 
                  type="email" 
                  placeholder="ankit@vertis.co.in"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (userFormErrors.email) {
                      const newErrors = { ...userFormErrors };
                      delete newErrors.email;
                      setUserFormErrors(newErrors);
                    }
                  }}
                  style={{ 
                    width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none',
                    ...(userFormErrors.email ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : formData.email ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                  }}
                />
                {userFormErrors.email && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠ {userFormErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Role <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select 
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({ ...formData, role: e.target.value as User['role'] });
                    if (userFormErrors.role) {
                      const newErrors = { ...userFormErrors };
                      delete newErrors.role;
                      setUserFormErrors(newErrors);
                    }
                  }}
                  style={{ 
                    width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none', backgroundColor: 'white',
                    ...(userFormErrors.role ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : formData.role ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                  }}
                >
                  <option value="">Select Role</option>
                  <option>Maker</option>
                  <option>Checker</option>
                  <option>Viewer</option>
                  <option>Super Admin</option>
                </select>
                {userFormErrors.role && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠ {userFormErrors.role}
                  </p>
                )}
              </div>

              <div style={{ backgroundColor: '#FDF0F0', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#6B7280' }}>
                <p style={{ margin: '0 0 4px 0', fontWeight: '600', color: '#8B1A1A' }}>Role Permissions:</p>
                <p style={{ margin: '2px 0' }}>• Maker: Can create and submit BENPOS/Distribution data</p>
                <p style={{ margin: '2px 0' }}>• Checker: Can approve or reject submissions</p>
                <p style={{ margin: '2px 0' }}>• Viewer: Read-only access to reports and data</p>
                <p style={{ margin: '2px 0' }}>• Super Admin: Full access including user management</p>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>Mobile (Optional)</label>
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210"
                  value={formData.mobile}
                  onChange={(e) => {
                    setFormData({ ...formData, mobile: e.target.value });
                    if (userFormErrors.mobile) {
                      const newErrors = { ...userFormErrors };
                      delete newErrors.mobile;
                      setUserFormErrors(newErrors);
                    }
                  }}
                  style={{ 
                    width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none',
                    ...(userFormErrors.mobile ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : formData.mobile ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                  }}
                />
                {userFormErrors.mobile && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠ {userFormErrors.mobile}
                  </p>
                )}
              </div>

              <div style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#92400E', display: 'flex', gap: '8px' }}>
                <Info size={16} style={{ flexShrink: 0 }} />
                <span>A temporary password will be sent to the user's email address after account creation.</span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button 
                  onClick={() => setShowAddModal(false)}
                  disabled={isLoading}
                  style={{ flex: 1, border: '1px solid #D1D5DB', backgroundColor: 'white', color: '#374151', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddUser}
                  disabled={isLoading}
                  style={{ flex: 1, backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>Create User →</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedUser && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex',
          justifyContent: 'center', alignItems: 'flex-start', paddingTop: '80px'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px',
            padding: '32px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
          }}>
            <button 
              onClick={() => setShowEditModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', border: 'none', background: 'none', cursor: 'pointer', color: '#9CA3AF' }}
            >
              <X size={24} />
            </button>
            <h2 style={{ fontWeight: 'bold', fontSize: '20px', color: '#1A1A1A', margin: 0 }}>Edit User — {selectedUser.name}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
              {Object.keys(userFormErrors).length > 0 && (
                <div style={{
                  backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5',
                  borderRadius: '10px', padding: '12px', mb: '16px',
                  fontSize: '13px', color: '#DC2626'
                }}>
                  Please fix {Object.keys(userFormErrors).length} error(s) before submitting.
                </div>
              )}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Full Name <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (userFormErrors.name) {
                      const newErrors = { ...userFormErrors };
                      delete newErrors.name;
                      setUserFormErrors(newErrors);
                    }
                  }}
                  style={{ 
                    width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none',
                    ...(userFormErrors.name ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : formData.name ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                  }}
                />
                {userFormErrors.name && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠ {userFormErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Email <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (userFormErrors.email) {
                      const newErrors = { ...userFormErrors };
                      delete newErrors.email;
                      setUserFormErrors(newErrors);
                    }
                  }}
                  style={{ 
                    width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none',
                    ...(userFormErrors.email ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : formData.email ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                  }}
                />
                {userFormErrors.email && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠ {userFormErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px', display: 'block' }}>
                  Role <span style={{ color: '#DC2626' }}>*</span>
                </label>
                <select 
                  value={formData.role}
                  onChange={(e) => {
                    setFormData({ ...formData, role: e.target.value as User['role'] });
                    if (userFormErrors.role) {
                      const newErrors = { ...userFormErrors };
                      delete newErrors.role;
                      setUserFormErrors(newErrors);
                    }
                  }}
                  style={{ 
                    width: '100%', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '10px', fontSize: '14px', outline: 'none', backgroundColor: 'white',
                    ...(userFormErrors.role ? { border: '1px solid #DC2626', backgroundColor: '#FEF2F2' } : formData.role ? { border: '1px solid #86EFAC', backgroundColor: '#F0FDF4' } : {})
                  }}
                >
                  <option value="">Select Role</option>
                  <option>Maker</option>
                  <option>Checker</option>
                  <option>Viewer</option>
                  <option>Super Admin</option>
                </select>
                {userFormErrors.role && (
                  <p style={{ color: '#DC2626', fontSize: '12px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⚠ {userFormErrors.role}
                  </p>
                )}
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px', display: 'block' }}>Account Status</label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => setFormData({ ...formData, status: 'Active' })}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                      border: `1px solid ${formData.status === 'Active' ? '#166534' : '#D1D5DB'}`,
                      backgroundColor: formData.status === 'Active' ? '#F0FDF4' : '#F3F4F6',
                      color: formData.status === 'Active' ? '#166534' : '#6B7280',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: formData.status === 'Active' ? '#166534' : '#9CA3AF' }} />
                    Active
                  </button>
                  <button 
                    onClick={() => setFormData({ ...formData, status: 'Inactive' })}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: '600',
                      border: `1px solid ${formData.status === 'Inactive' ? '#D1D5DB' : '#D1D5DB'}`,
                      backgroundColor: formData.status === 'Inactive' ? '#F3F4F6' : '#F3F4F6',
                      color: formData.status === 'Inactive' ? '#6B7280' : '#6B7280',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      ...(formData.status === 'Inactive' ? { border: '1px solid #6B7280', backgroundColor: '#F3F4F6', color: '#1A1A1A' } : {})
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: formData.status === 'Inactive' ? '#1A1A1A' : '#9CA3AF' }} />
                    Inactive
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button 
                  onClick={() => setShowEditModal(false)}
                  disabled={isLoading}
                  style={{ flex: 1, border: '1px solid #D1D5DB', backgroundColor: 'white', color: '#374151', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer', opacity: isLoading ? 0.5 : 1 }}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleEditUser}
                  disabled={isLoading}
                  style={{ flex: 1, backgroundColor: '#8B1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isLoading ? 0.7 : 1 }}
                >
                  {isLoading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>Save Changes ✓</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
