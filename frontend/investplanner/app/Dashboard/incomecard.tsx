"use client"
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { apiCall } from "../lib/api";

export default function IncomeCard() {
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchIncome = async () => {
      setLoading(true);
      try {
        const data = await apiCall("/expense/income");
        if (data && data.income) {
          const total = data.income.reduce(
            (sum: number, item: any) => sum + (Number(item.amount) || 0),
            0
          );
          setTotalIncome(total);
        }
      } catch (error) {
        console.error("Failed to fetch income:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncome();

    // Re-fetch when a new transaction is added
    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', fetchIncome);
      return () => window.removeEventListener('transactionAdded', fetchIncome);
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[9.5rem] bg-white rounded-xl shadow-sm p-5 flex flex-col justify-between border border-gray-100">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Income</h2>
        <p className="text-3xl font-bold text-black mt-1">
          {loading ? "..." : `₹${totalIncome.toLocaleString()}`}
        </p>
      </div>
      <div className="w-10 h-10 mt-4 rounded-full bg-emerald-50 flex items-center justify-center cursor-pointer hover:bg-emerald-100 transition border border-emerald-100">
        <ArrowUp size={20} className="text-emerald-500" />
      </div>
    </div>
  );
}