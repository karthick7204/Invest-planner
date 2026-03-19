import type { Metadata } from "next";
import { Poppins } from "next/font/google"; 
import "./globals.css";
import Header from "./header/header";
import Sidebar from "./sidebar/sidebar";

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
      <body>
          {children}
      </body>
  );
}