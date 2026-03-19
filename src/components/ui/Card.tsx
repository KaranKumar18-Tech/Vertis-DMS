import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  [key: string]: any;
}

export const Card = ({ children, className, title, subtitle, footer, ...props }: CardProps) => {
  return (
    <div className={cn('bg-white rounded-xl border border-[#D4A0A0] shadow-sm overflow-hidden', className)} {...props}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-[#D4A0A0] bg-[#FDF0F0]">
          {title && <h3 className="text-lg font-bold text-[#8B1A1A]">{title}</h3>}
          {subtitle && <p className="text-sm text-[#1A1A1A] mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="px-6 py-4 bg-[#FDF0F0] border-t border-[#D4A0A0]">{footer}</div>}
    </div>
  );
};
