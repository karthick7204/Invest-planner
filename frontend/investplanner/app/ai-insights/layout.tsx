import type { Metadata } from "next";
import Header from "@/app/header/header";
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
    <body className="antialiased">
      <Sidebar />
      <div className="flex flex-col h-screen w-full lg:pl-64 bg-[#fbfbfb]">
        {/* Fixed Header */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
          <Header />
        </div>

        {/* Scrollable Content */}
        <main className="mt-16 flex-1 overflow-x-hidden overflow-y-auto font-poppins">
          {children}
        </main>
      </div>
    </body>
  );
}
