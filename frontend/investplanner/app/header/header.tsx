'use client'
import { useState } from "react";
import AddTransactionModal from "../modals/addTransaction";
import { User, Download } from 'lucide-react';
import { usePwaInstall } from "../hooks/usePwaInstall";

export default function Header(){
      const [isModalOpen, setIsModalOpen] = useState(false);
      const { isInstallable, isInstalled, triggerInstallPrompt } = usePwaInstall();

        const handleTransactionAdded = () => {
        console.log('✅ Transaction added successfully');
        // Refresh transactions list or update state here
        // You can fetch new transactions from API if needed
  };
    return (
        <div className="flex items-center justify-between px-4 py-3 border-b-2 bg-white border-gray-200 shadow-sm sticky top-0 z-50">
            {/* Logo */}
            <h1 className="text-black font-bold text-2xl md:text-3xl whitespace-nowrap">
                Spend<span className="text-yellow-400">ly</span>
            </h1>

            <div className="flex items-center gap-3 md:gap-4">
                {/* Install App Quick Action (only visible if installable) */}
                {isInstallable && !isInstalled && (
                    <button
                        onClick={triggerInstallPrompt}
                        className="flex items-center gap-1.5 border-2 border-yellow-400 bg-yellow-50 hover:bg-yellow-100 text-black rounded px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base font-medium transition-colors cursor-pointer"
                        aria-label="Install Spendly Application"
                    >
                        <Download size={16} className="text-yellow-600" />
                        <span className="hidden sm:inline">Install App</span>
                        <span className="sm:hidden">Install</span>
                    </button>
                )}

                {/* Add Transaction Button */}
                <div className='border-2 border-gray-300 rounded px-3 py-1.5 md:px-4 md:py-2 cursor-pointer hover:bg-gray-50 transition-colors'>
                    <button 
                        onClick={() => setIsModalOpen(true)} 
                        className="cursor-pointer text-black text-sm md:text-base font-medium whitespace-nowrap"
                    >
                        <span className="hidden sm:inline">Add Transaction</span>
                        <span className="sm:hidden">+ Add Transaction</span>
                    </button>
                </div>

                {/* User Profile Icon */}
                <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition shrink-0">
                    <User size={20} />
                </div>
            </div>

            <AddTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTransactionAdded={handleTransactionAdded}
            />
        </div>
    )
}