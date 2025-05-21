'use client';

import HeaderSuperuser from '@/components/HeaderSuperuser';
import SidebarSuperuser from '@/components/SidebarSuperuser';
import { ReactNode } from 'react';

export default function SuperuserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-zinc-950">
      {/* Sidebar */}
      <SidebarSuperuser />

      {/* Content */}
      <div className="flex flex-col flex-1">
        <HeaderSuperuser />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
