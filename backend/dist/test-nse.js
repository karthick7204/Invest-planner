import { NseIndia } from "stock-nse-india-secure";
const nse = new NseIndia();
async function test() {
    try {
        console.log("Fetching NIFTY 100...");
        const stocks = await nse.getEquityStockIndices("NIFTY 100");
        console.log("Success! Found", stocks.data.length, "stocks.");
        process.exit(0);
    }
    catch (error) {
        console.error("Error fetching stocks:", error);
        process.exit(1);
    }
}
test();
//# sourceMappingURL=test-nse.js.map