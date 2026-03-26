"use client";

import { Download } from "lucide-react";

export function ReportHeader() {
    const handleDownload = () => {
        // Logic to export the report to PDF or CSV goes here
        console.log("Triggering report download...");
        alert("Downloading report...");
    };

    return(
        <div className="flex w-full justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-black">Financial Reports</h1>
                <p className="text-gray-600 mt-2">Deep-dive analysis of your spending habits and capital growth recommendations.</p>
            </div>
            <button 
                onClick={handleDownload}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl shadow-md hover:bg-gray-800 transition text-sm font-medium shrink-0"
            >
                <Download size={18} />
                Download
            </button>
        </div>
    )
}