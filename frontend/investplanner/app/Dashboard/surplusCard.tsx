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
    <div className="w-full h-full min-h-[9.5rem] bg-yellow-300 rounded-xl shadow-sm p-5 flex flex-col justify-between border border-yellow-400/50">
      <div>
        <h2 className="text-sm font-semibold text-yellow-900 uppercase tracking-wide">Surplus</h2>
        <p className="text-3xl font-bold text-black mt-1">
          {loading ? "..." : `₹${surplus.toLocaleString()}`}
        </p>
      </div>
      <div className="w-10 h-10 mt-4 rounded-full bg-yellow-400 flex items-center justify-center cursor-pointer hover:bg-yellow-500 transition shadow-inner" title="Surplus">
        <Wallet size={20} className="text-yellow-900" />
      </div>
    </div>
  )
}