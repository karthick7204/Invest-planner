"use client";

import { Download } from "lucide-react";

export function ReportHeader() {
    const handleDownload = () => {
        // Logic to export the report to PDF or CSV goes here
        console.log("Triggering report download...");
        alert("Downloading report...");
    };

    return(
        <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Financial Report</h1>
                <p className="text-gray-400 text-sm font-medium">Detailed analysis of your spending habits and capital growth recommendations.</p>
            </div>
            <button 
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all active:scale-95 text-sm font-black shrink-0"
            >
                <Download size={18} strokeWidth={2.5} />
                Export Data
            </button>
        </div>
    )
}