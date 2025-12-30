export const splitUpCalculation = (stocks:number, mutualfunds:number, gold:number ,surplusamount:number ) => {
    try{
        const surplus =surplusamount;
        const for_Stocks = surplus * (stocks/100)
        const for_Mutualfunds = surplus * (mutualfunds/100)
        const for_Gold = surplus * (gold/100)

        return {for_Stocks, for_Mutualfunds, for_Gold};
    }catch(error){
        console.log("splitUpCalculation error",error)
        throw new Error("Error in splitUpCalculation");
    }   
}