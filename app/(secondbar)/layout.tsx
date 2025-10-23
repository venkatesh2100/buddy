// app/(secondbar)/layout.tsx
'use client';

import { usePathname } from 'next/navigation';
import SecondNavbar from '../components/navbar/SecondNavbar';
export default function SecondNavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();


  const activeTab = pathname.includes('/organization') ? 'manage' : 'dashboard';


  return (
    <div className="w-full">
      <SecondNavbar activeTab={activeTab} />
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}