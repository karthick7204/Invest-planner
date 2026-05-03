import SuggestedStocks from "./suggestedstocks";

export default function StockSuggestionsPage() {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-start justify-start gap-6 pb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-black tracking-tight">Stock Suggestions</h1>
      <SuggestedStocks />
    </div>
  );
}
