export const stockCalculator = (stocks: any,surplusamount: number) => {
    let suggestedStocks = [];
    for(const stock of stocks){
        if(stock.lastprice <= surplusamount){
            suggestedStocks.push({symbol:stock.symbol, lastprice:stock.lastprice});
        }
    }
     return suggestedStocks;

}
