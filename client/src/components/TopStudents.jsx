import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopStudentsChart = ({ topStudents }) => {
  const data = {
    labels: topStudents.map((s) => s.name),
    datasets: [
      {
        label: "Average Score",
        data: topStudents.map((s) => s.avg),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };

  const options = {
    indexAxis: "y", // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className=" bg-white shadow-lg rounded-lg h-[410px]">
    <div className="p-4 bg-white rounded-lg h-96">
      <h2 className="text-lg font-semibold mb-2">Top 5 Performing Students</h2>
      <Bar data={data} options={options} />
    </div>
    </div>
  );
};

export default TopStudentsChart;
