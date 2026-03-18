'use client'
import { use, useState } from "react";
import AddTransactionModal from "../modals/addTransaction";
import {  User } from 'lucide-react';

export default function Header(){
      const [isModalOpen, setIsModalOpen] = useState(false);
       const handleAddTransaction = (data: any) => {
       console.log('New transaction:', data);
       setIsModalOpen(false);
  };

    return(
        <div className="flex p-4 h-15 justify-between border-b-2 bg-[#ffffff] border-gray-200 shadow-lg ">
        <h1 className="absolute left-3 top-3 text-black font-bold text-3xl">Wealth <span className="text-yellow-400">Pilot</span></h1>
            <div className='border-2 absolute right-20 top-2  border-gray-300 rounded px-4 py-2 cursor-pointer'>
                <div>
                    <button onClick={() => setIsModalOpen(true)} className="cursor-pointer text-black">Add Transaction</button>
                     <AddTransactionModal 
                     isOpen={isModalOpen}
                     onClose={() => setIsModalOpen(false)}
                     onSubmit={handleAddTransaction}
      />
                </div>
            </div>
            <div className="w-10 h-10 absolute top-2 right-4 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
              <User size={20} />
            </div>
        </div>
       
    )
}