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
    <div className="w-90 h-38 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-md font-semibold text-mauve-400">Income</h2>
      <p className="text-2xl font-bold text-black">
        {loading ? "..." : `₹${totalIncome.toLocaleString()}`}
      </p>
      <div className="w-10 h-10 mt-2 rounded-full bg-green-100 flex items-center justify-center cursor-pointer hover:bg-green-200 transition">
        <ArrowUp size={20} className="text-green-600" />
      </div>
    </div>
  );
}