import SuggestedStocks from "./suggestedstocks";

export default function StockSuggestionsPage() {
  return (
    <div className="ml-64 p-8 w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-black">Stock Suggestions</h1>
      <SuggestedStocks />
    </div>
  );
}
