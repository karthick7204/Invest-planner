export const surplus = async( totalIncome : number , totalExpense : number) => {
        try{
        const surplusAmount = Math.max(0, totalIncome - totalExpense);  
        return surplusAmount;               
        }catch(error){
            console.log("surplus calculation error",error)
            throw new Error("Error in calculating surplus");
        }       
    }