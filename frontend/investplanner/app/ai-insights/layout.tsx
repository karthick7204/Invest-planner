import type { Metadata } from "next";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";

export const metadata: Metadata = {
  title: "AI Insights | InvestPlanner",
  description: "Advanced AI financial insights for your wealth growth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen w-full lg:pl-64 bg-[#f6f7f6]">
      <Sidebar />
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-800">
        <Header />
      </div>

      {/* Scrollable Content */}
      <main className="mt-12 flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 font-poppins">
        {children}
      </main>
    </div>
  );
}
