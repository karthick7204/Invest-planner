"use client"
import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { apiCall } from "../lib/api";

export function SurplusCard() {
  const [surplus, setSurplus] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSurplus = async () => {
      setLoading(true);
      try {
        const data = await apiCall("/expense/surplusincome");
        if (data && data.surplus !== undefined) {
          setSurplus(data.surplus);
        }
      } catch (error) {
        console.error("Failed to fetch surplus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurplus();

    // Re-fetch when a new transaction is added
    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', fetchSurplus);
      return () => window.removeEventListener('transactionAdded', fetchSurplus);
    }
  }, []);

  return (
    <div className="w-90 h-38 bg-yellow-300 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold text-black">Surplus</h2>
      <p className="text-2xl font-bold text-black">
        {loading ? "..." : `₹${surplus.toLocaleString()}`}
      </p>
        <div className='w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-200 transition' title="Surplus">
        <Wallet size={20} className="text-blue-600" />
        </div>
    </div>
  )
}