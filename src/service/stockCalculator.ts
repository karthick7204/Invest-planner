export const stockCalculator = (stocks: any) => {
    let suggestedStocks = [];
    for(const stock of stocks){
        if(stock.lastprice <= 1000){
            suggestedStocks.push({symbol:stock.symbol, lastprice:stock.lastprice});
        }
    }
     return suggestedStocks;

}