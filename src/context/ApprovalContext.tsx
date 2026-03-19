import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Stat {
  label: string;
  value: string;
  color: string;
}

interface ApprovalItem {
  id: string;
  type: string;
  title: string;
  stats: Stat[];
  timer: string;
  gridCols: number;
  submittedAt?: string;
  submittedBy?: string;
  quarter?: string;
  fy?: string;
  type_key?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Notification {
  id: string;
  type: 'approval' | 'rejection';
  itemId: string;
  itemType: string;
  title: string;
  message: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  reason?: string;
  comment?: string;
  read: boolean;
}

interface ApprovalContextType {
  pendingApprovals: ApprovalItem[];
  approvedItems: string[];
  rejectedItems: Record<string, { reason: string; comment: string; rejectedAt: string; rejectedBy?: string }>;
  notifications: Notification[];
  unreadCount: number;
  submitForApproval: (item: Omit<ApprovalItem, 'status'>) => void;
  approveItem: (id: string, item: ApprovalItem) => void;
  rejectItem: (id: string, item: ApprovalItem, reason: string, comment: string) => void;
  clearRejection: (id: string) => void;
  markAllRead: () => void;
  markOneRead: (notifId: string) => void;
  isItemPending: (id: string, quarter?: string, fy?: string) => boolean;
  isItemApproved: (id: string, quarter?: string, fy?: string) => boolean;
  isItemRejected: (id: string, quarter?: string, fy?: string) => { reason: string; comment: string; rejectedAt: string; rejectedBy?: string } | null;
  resetDemo: () => void;
}

const ApprovalContext = createContext<ApprovalContextType | undefined>(undefined);

export function ApprovalProvider({ children }: { children: ReactNode }) {
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([]);
  const [approvedItems, setApprovedItems] = useState<string[]>([]);
  const [rejectedItems, setRejectedItems] = useState<Record<string, any>>({});
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const submitForApproval = (item: Omit<ApprovalItem, 'status'>) => {
    setPendingApprovals(prev => {
      if (prev.some(p => p.id === item.id)) return prev;
      
      return [...prev, {
        ...item,
        submittedAt: new Date().toLocaleString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        }),
        submittedBy: 'Rahul Sharma',
        status: 'pending'
      }];
    });
  };
  
  const approveItem = (id: string, item: ApprovalItem) => {
    try {
      if (!id) return;
      
      setPendingApprovals(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.filter(i => i.id !== id);
      });
      
      setApprovedItems(prev => {
        if (!Array.isArray(prev)) return [id];
        return [...prev, id];
      });

      setNotifications(prev => {
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          type: 'approval',
          itemId: id,
          itemType: item?.type || 'Unknown',
          title: `${item?.type || 'Item'} Approved`,
          message: `${item?.title || 'Submission'} approved and is now active.`,
          approvedBy: 'Ashish Ranjan',
          approvedAt: new Date().toLocaleString('en-IN'),
          read: false
        };
        return Array.isArray(prev) ? [newNotif, ...prev] : [newNotif];
      });
      
      setUnreadCount(prev => (typeof prev === 'number' ? prev : 0) + 1);
    } catch (error) {
      console.error('Error in approveItem context function:', error);
    }
  };

  const rejectItem = (id: string, item: ApprovalItem, reason: string, comment: string) => {
    try {
      if (!id) return;
      
      setPendingApprovals(prev => {
        if (!Array.isArray(prev)) return [];
        return prev.filter(i => i.id !== id);
      });
      
      setRejectedItems(prev => {
        const safePrev = (prev && typeof prev === 'object') ? prev : {};
        return {
          ...safePrev,
          [id]: {
            reason: reason || 'No reason provided',
            comment: comment || '',
            rejectedAt: new Date().toLocaleString('en-IN'),
            rejectedBy: 'Ashish Ranjan'
          }
        };
      });

      setNotifications(prev => {
        const newNotif: Notification = {
          id: `notif-${Date.now()}`,
          type: 'rejection',
          itemId: id,
          itemType: item?.type || 'Unknown',
          title: `${item?.type || 'Item'} Rejected`,
          message: `${item?.title || 'Submission'} rejected. Reason: ${reason}`,
          rejectedBy: 'Ashish Ranjan',
          rejectedAt: new Date().toLocaleString('en-IN'),
          reason,
          comment,
          read: false
        };
        return Array.isArray(prev) ? [newNotif, ...prev] : [newNotif];
      });
      
      setUnreadCount(prev => (typeof prev === 'number' ? prev : 0) + 1);
    } catch (error) {
      console.error('Error in rejectItem context function:', error);
    }
  };

  const clearRejection = (id: string) => {
    setRejectedItems(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markOneRead = (notifId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notifId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const isItemPending = (
    type: string, 
    quarter?: string, 
    fy?: string
  ) => {
    if (quarter && fy) {
      const fyClean = fy.replace(' ', '')
      const id = `${type}-${quarter}-${fyClean}`
      return pendingApprovals.some(item => 
        item.id === id)
    }
    return pendingApprovals.some(item => 
      item.id === type)
  }

  const isItemApproved = (
    type: string,
    quarter?: string,
    fy?: string
  ) => {
    if (quarter && fy) {
      const fyClean = fy.replace(' ', '')
      const id = `${type}-${quarter}-${fyClean}`
      return approvedItems.includes(id)
    }
    return approvedItems.includes(type)
  }

  const isItemRejected = (
    type: string,
    quarter?: string,
    fy?: string
  ) => {
    if (quarter && fy) {
      const fyClean = fy.replace(' ', '')
      const id = `${type}-${quarter}-${fyClean}`
      return rejectedItems[id] || null
    }
    return rejectedItems[type] || null
  }

  const resetDemo = () => {
    setPendingApprovals([]);
    setApprovedItems([]);
    setRejectedItems({});
    setNotifications([]);
    setUnreadCount(0);
  };
  
  return (
    <ApprovalContext.Provider value={{ 
      pendingApprovals, 
      approvedItems,
      rejectedItems,
      notifications,
      unreadCount,
      submitForApproval,
      approveItem,
      rejectItem,
      clearRejection,
      markAllRead,
      markOneRead,
      isItemPending,
      isItemApproved,
      isItemRejected,
      resetDemo
    }}>
      {children}
    </ApprovalContext.Provider>
  );
}

export const useApprovals = () => {
  const context = useContext(ApprovalContext);
  if (context === undefined) {
    throw new Error('useApprovals must be used within an ApprovalProvider');
  }
  return context;
};
