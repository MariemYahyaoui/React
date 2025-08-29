import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function PriceHistoryChart({ chartData }) {
  if (!chartData || chartData.length === 0) return null;

  const data = {
    labels: chartData.map((d) => d.date),
    datasets: [
      { label: "Min", data: chartData.map((d) => d.minPrice), tension: 0.2 },
      { label: "Max", data: chartData.map((d) => d.maxPrice), tension: 0.2 },
      { label: "Avg", data: chartData.map((d) => d.avgPrice), tension: 0.2 },
    ],
  };

  return (
    <div className="card mb-3 p-3">
      <Line data={data} />
    </div>
  );
}
