"use client"
import { useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";
import { apiCall } from "../lib/api";

export function ExpenseCard() {
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const data = await apiCall("/expense/expenses");
        if (data && data.expenses) {
          const total = data.expenses.reduce(
            (sum: number, item: any) => sum + (Number(item.amount) || 0),
            0
          );
          setTotalExpense(total);
        }
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();

    // Re-fetch when a new transaction is added
    if (typeof window !== 'undefined') {
      window.addEventListener('transactionAdded', fetchExpenses);
      return () => window.removeEventListener('transactionAdded', fetchExpenses);
    }
  }, []);

  return (
    <div className="w-full h-full min-h-[9.5rem] bg-white rounded-xl shadow-sm p-5 flex flex-col justify-between border border-gray-100">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Expenses</h2>
        <p className="text-3xl font-bold text-black mt-1">
          {loading ? "..." : `₹${totalExpense.toLocaleString()}`}
        </p>
      </div>
      <div className="w-10 h-10 mt-4 rounded-full bg-red-50 flex items-center justify-center cursor-pointer hover:bg-red-100 transition border border-red-100">
        <ArrowDown size={20} className="text-red-500" />
      </div>
    </div>
  );
}