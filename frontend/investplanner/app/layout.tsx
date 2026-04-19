import type { Metadata } from "next";
import { Poppins } from "next/font/google"; 
import "./globals.css";
import Header from "./header/header";
import Sidebar from "./sidebar/sidebar";

import { Fredoka } from "next/font/google";

import Script from "next/script";

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
    <html lang="en">
        <head>
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-XXXXXXXXXX');
            `}
          </Script>
        </head>
        <body className={fredoka.variable}>
          {children}
      </body>
    </html>
      
  );
}