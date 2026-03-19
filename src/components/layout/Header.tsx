import React, { useState, useEffect } from 'react';
import { Bell, Search, User, LogOut, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
import { useApprovals } from '../../context/ApprovalContext';

export const Header = ({ title }: { title: string }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAllRead, markOneRead } = useApprovals();
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notif-wrapper')) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const getRoute = (itemId: string) => {
    if (itemId.startsWith('benpos')) return 'benpos-upload';
    if (itemId.startsWith('distribution-processing')) return 'processing';
    if (itemId.startsWith('distribution-master')) return 'distribution-master';
    return 'dashboard';
  };

  return (
    <header className="h-16 bg-white border-b border-[#F0E8E8] flex items-center justify-between px-8 sticky top-0 z-30">
      <h2 className="text-xl font-bold text-[#8B1A1A]">{title}</h2>
      
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-white border border-[#D4A0A0] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B1A1A]/20 focus:border-[#8B1A1A] w-64 transition-all"
          />
        </div>
        
        <div className="relative notif-wrapper">
          <button
            onClick={() => setShowNotifDropdown(prev => !prev)}
            style={{
              position: 'relative',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Bell size={20} color="#6B7280" />
            
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: '#DC2626',
                color: 'white',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifDropdown && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: '0',
              width: '380px',
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              border: '1px solid #E5E7EB',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              <div style={{
                backgroundColor: '#8B1A1A',
                padding: '14px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>{unreadCount} unread</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      color: 'rgba(255,255,255,0.8)',
                      fontSize: '12px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                      <Bell size={32} color="#E5E7EB" />
                    </div>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', margin: 0 }}>No notifications yet</p>
                    <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '4px', margin: 0 }}>
                      Approval and rejection updates will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markOneRead(notif.id);
                        setShowNotifDropdown(false);
                        navigate(`/admin/${getRoute(notif.itemId)}`);
                      }}
                      style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid #F3F4F6',
                        cursor: 'pointer',
                        backgroundColor: notif.read ? 'white' : '#FDF0F0',
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        backgroundColor: notif.type === 'approval' ? '#F0FDF4' : '#FEF2F2'
                      }}>
                        {notif.type === 'approval' ? (
                          <CheckCircle size={18} color="#166534" />
                        ) : (
                          <XCircle size={18} color="#DC2626" />
                        )}
                      </div>
                      
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <span style={{ 
                            fontWeight: '600', 
                            fontSize: '13px',
                            color: notif.type === 'approval' ? '#166534' : '#DC2626'
                          }}>
                            {notif.title}
                          </span>
                          <span style={{ color: '#9CA3AF', fontSize: '11px' }}>
                            {notif.type === 'approval' ? notif.approvedAt : notif.rejectedAt}
                          </span>
                        </div>
                        
                        <p style={{ 
                          color: '#374151', 
                          fontSize: '12px', 
                          marginTop: '4px', 
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {notif.message}
                        </p>
                        
                        {notif.type === 'rejection' && notif.reason && (
                          <span style={{
                            display: 'inline-block',
                            marginTop: '6px',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            borderRadius: '20px',
                            padding: '2px 10px',
                            fontSize: '11px',
                            fontWeight: '500'
                          }}>
                            {notif.reason}
                          </span>
                        )}
                      </div>
                      
                      {!notif.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#8B1A1A',
                          flexShrink: 0,
                          marginTop: '4px'
                        }}/>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div style={{
                borderTop: '1px solid #E5E7EB',
                padding: '12px 20px',
                backgroundColor: '#F9F9F9',
                textAlign: 'center'
              }}>
                <span style={{ color: '#9CA3AF', fontSize: '11px' }}>
                  Notifications are for this session only
                </span>
              </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-[#1A1A1A]">Ashish Ranjan</span>
            <span className="text-[10px] bg-[#FDF0F0] text-[#8B1A1A] border border-[#D4A0A0] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Creator</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#FDF0F0] flex items-center justify-center border border-[#D4A0A0]">
            <User className="h-4 w-4 text-[#8B1A1A]" />
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#8B1A1A] hover:bg-[#FDF0F0] p-2"
            onClick={() => navigate('/admin/login')}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
