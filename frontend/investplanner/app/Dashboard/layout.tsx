import type { Metadata } from 'next';
import Header from '@/app/header/header';
import Sidebar from '../sidebar/sidebar';

export const metadata: Metadata = {
  title: 'Dashboard | Invest Planner',
  description: 'Manage your finances and capital with monochrome precision',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-950 antialiased selection:bg-neutral-900 selection:text-white">
      <Sidebar />
      <div className="flex flex-col min-h-screen w-full lg:pl-64">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>

        {/* Scrollable Content */}
        <main className="mt-14 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}