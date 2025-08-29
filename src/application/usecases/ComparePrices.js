import PriceComparisonRepository from "../../data/repositories/PriceComparisonRepository";
import { getBestAndWorstPrice, prepareChartData } from "../../core/services/PriceService";

export async function comparePrices(productId) {
  const repo = new PriceComparisonRepository();
  const entries = await repo.getForProduct(productId);

  const { min, max } = getBestAndWorstPrice(entries);
  const chartData = prepareChartData(entries);

  return { prices: entries, best: min, worst: max, chartData };
}
