import React from 'react';
import { cn } from '../../lib/utils';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ headers, children, className }: TableProps) => {
  return (
    <div className={cn('w-full overflow-x-auto rounded-lg border border-[#D4A0A0]', className)}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-white uppercase bg-[#8B1A1A] border-b border-[#D4A0A0]">
          <tr>
            {headers.map((header, i) => (
              <th key={i} className="px-6 py-4 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#D4A0A0]">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableRow = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <tr className={cn('bg-white hover:bg-[#FDF0F0] transition-colors', className)} {...props}>{children}</tr>
);

export const TableCell = ({ children, className, ...props }: { children: React.ReactNode; className?: string; [key: string]: any }) => (
  <td className={cn('px-6 py-4 text-slate-600', className)} {...props}>{children}</td>
);
