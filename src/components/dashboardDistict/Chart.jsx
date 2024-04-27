import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

const ChartComponent = ({ chartId, data }) => {
  const chartConfig = {
    labels: data.labels,
    datasets: [
      {
        label: chartId.includes("Chart") ? chartId.split("Chart")[0] : chartId,
        data: data.values,
        backgroundColor: [
          "#21D4FD",
          "#FF5F6D",
          "#78FFD6",
          "#7E57C2",
          "#FFCA28",
          "#FF7043",
          "#BA68C8",
          "#26A69A",
          "#42A5F5",
          "#FFA726",
          "#EF5350",
          "#66BB6A",
        ],
        borderColor: "rgba(255, 255, 255, 0.5)",
        borderWidth: 2,
        cutout: "60%",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "rgba(255, 255, 255, 0.87)" },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        titleColor: "rgba(255, 255, 255, 1)",
        bodyColor: "rgba(255, 255, 255, 0.87)",
      },
    },
    scales:
      chartId === "taskStatusChart"
        ? {
            x: {
              grid: { color: "#37474F" },
              ticks: { color: "rgba(255, 255, 255, 0.87)" },
            },
            y: {
              grid: { color: "#37474F" },
              ticks: { color: "rgba(255, 255, 255, 0.87)" },
            },
          }
        : undefined,
    animation: { animateScale: true, animateRotate: true },
  };

  const ChartType = chartId === "taskStatusChart" ? Bar : Doughnut;

  return (
    <div className="h-96 w-full bg-gray-900 rounded flex items-center justify-center">
      <ChartType data={chartConfig} options={chartOptions} />
    </div>
  );
};

export default ChartComponent;
