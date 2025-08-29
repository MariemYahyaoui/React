import { getPricesForProduct } from "../../data/Api";

export async function compareProducts(productId) {
  const prices = getPricesForProduct(productId);

  if (!prices || prices.length === 0) return { prices: [], best: 0, worst: 0, chartData: [] };

  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);
  const best = sortedPrices[0].price;
  const worst = sortedPrices[sortedPrices.length - 1].price;

  const chartData = sortedPrices.map(p => ({
    date: new Date(p.date).toLocaleDateString(),
    price: p.price,
  }));

  return { prices, best, worst, chartData };
}
