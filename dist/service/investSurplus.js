export const surplus = async (totalIncome, totalExpense) => {
    try {
        const surplusAmount = totalIncome - totalExpense;
        return surplusAmount;
    }
    catch (error) {
        console.log("surplus calculation error", error);
        throw new Error("Error in calculating surplus");
    }
};
//# sourceMappingURL=investSurplus.js.map