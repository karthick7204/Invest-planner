import type { Metadata } from "next";
import { Poppins } from "next/font/google"; 
import Header from "@/app/header/header";
import Sidebar from "../sidebar/sidebar";

import { Fredoka } from "next/font/google";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "InvestPlanner",
  description: "Manage your finances smartly",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
   
      <body className="antialiased">
        <aside className="w-64 fixed left-0 top-7 h-screen overflow-y-auto">
          <Sidebar />
        </aside>
        <div className="flex flex-col h-screen w-full">
          {/* Fixed Header */}
          <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-800">
            <Header />
          </div>

          {/* Scrollable Content */}
          <main className="mt-12 flex-1 overflow-y-auto p-8 bg-white font-poppins">
            {children}
          </main>
        </div>
      </body>

  );
}