import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ClassPerformanceChart = ({ classData }) => {
  const data = {
    labels: ["Chp 1", "Chp 2", "Chp 3", "Chp 4", "Chp 5"],
    datasets: [
      {
        label: "Class Average",
        data: classData, // Pass class scores dynamically
        borderColor: "blue",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className=" bg-white shadow-lg rounded-lg h-[410px]">
    <div className="p-4 bg-white rounded-lg h-96">
      <h2 className="text-lg font-semibold mb-2">Class Performance Over Time</h2>
      <Line data={data} options={options} />
    </div>
    </div>
  );
};

export default ClassPerformanceChart;
