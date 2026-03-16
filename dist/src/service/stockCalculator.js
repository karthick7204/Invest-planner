export const stockCalculator = (stocks, surplusamount) => {
    let suggestedStocks = [];
    for (const stock of stocks) {
        if (stock.lastprice <= surplusamount) {
            suggestedStocks.push({ symbol: stock.symbol, lastprice: stock.lastprice });
        }
    }
    return suggestedStocks;
};
//# sourceMappingURL=stockCalculator.js.map