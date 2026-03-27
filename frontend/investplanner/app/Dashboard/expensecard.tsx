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
    <div className="w-90 h-38 bg-white rounded-lg shadow-md p-4">
      <h2 className="text-md font-semibold text-mauve-400">Expenses</h2>
      <p className="text-2xl font-bold text-black">
        {loading ? "..." : `₹${totalExpense.toLocaleString()}`}
      </p>
      <div className="w-10 h-10 mt-2 rounded-full bg-red-100 flex items-center justify-center cursor-pointer hover:bg-red-200 transition">
        <ArrowDown size={20} className="text-red-600" />
      </div>
    </div>
  );
}