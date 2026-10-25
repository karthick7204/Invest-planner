import SuggestedStocks from './suggestedstocks';

export default function StockSuggestionsPage() {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-start justify-start gap-6 pb-12">
      <div className="pb-2 border-b border-neutral-200/60 w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">
          Stock Suggestions
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm font-normal mt-1">
          Quantitative market signals and capital allocation options
        </p>
      </div>
      <SuggestedStocks />
    </div>
  );
}
