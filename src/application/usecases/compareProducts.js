import { getPricesForProduct } from "../../data/Api";

// Updated compareProducts to properly await and return full objects
export async function compareProducts(productId) {
  const prices = await getPricesForProduct(productId); // ⚡ await added

  if (!prices || prices.length === 0) 
    return { prices: [], best: null, worst: null, chartData: [] };

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const best = sortedPrices[0]; // ⚡ return full object
  const worst = sortedPrices[sortedPrices.length - 1]; // ⚡ return full object

  const chartData = sortedPrices.map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    price: p.price,
  }));

  return { prices, best, worst, chartData };
}
