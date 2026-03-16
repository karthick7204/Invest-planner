export const savingCalculator = (amount, duration, unit) => {
    if (unit === "months") {
        duration = duration * 30;
    }
    else if (unit == "days") {
        duration = duration;
    }
    else if (unit === "years") {
        duration = duration * 365;
    }
    let dailySaving = Math.floor(amount / duration);
    return dailySaving;
};
//# sourceMappingURL=savingCalculator.js.map