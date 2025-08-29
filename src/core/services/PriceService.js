export function getBestAndWorstPrice(prices) {
  if (!prices || prices.length === 0) return { min: null, max: null };
  let min = prices[0];
  let max = prices[0];
  for (const p of prices) {
    if (p.price < min.price) min = p;
    if (p.price > max.price) max = p;
  }
  return { min, max };
}

export function groupPricesByDate(prices) {
  const groups = {};
  for (const p of prices) {
    const key = p.date.toISOString().split("T")[0];
    if (!groups[key]) groups[key] = [];
    groups[key].push(p.price);
  }
  return groups; // { '2025-08-28': [100, 120], ... }
}

export function prepareChartData(prices) {
  const grouped = groupPricesByDate(prices);
  return Object.keys(grouped)
    .sort()
    .map((date) => {
      const arr = grouped[date];
      const minPrice = Math.min(...arr);
      const maxPrice = Math.max(...arr);
      const avgPrice = arr.reduce((a, b) => a + b, 0) / arr.length;
      return { date, minPrice, maxPrice, avgPrice };
    });
}
