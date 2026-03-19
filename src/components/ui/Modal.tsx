import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal = ({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className={cn('bg-white rounded-2xl shadow-xl w-full border border-[#D4A0A0] animate-in fade-in zoom-in duration-200', sizes[size])}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4A0A0] bg-[#FDF0F0] rounded-t-2xl">
          <h3 className="text-lg font-bold text-[#8B1A1A]">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-1 h-8 w-8 text-[#8B1A1A] hover:bg-[#D4A0A0]/20">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 bg-[#FDF0F0] border-t border-[#D4A0A0] flex justify-end gap-3 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
