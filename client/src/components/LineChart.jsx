import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
} from "chart.js";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title);

const LineChart = ({ studentData }) => {
  const data = {
    labels: ["Chp 1", "Chp 2", "Chp 3", "Chp 4"], // Define labels explicitly
    datasets: [
      {
        label: "Performance Over Time",
        data: studentData.scores, // Ensure scores are being passed correctly
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: {
          display: true,
          text: "Grades", // Adding title for Y-Axis
        },
        min: 0,
        max: 100,
        
      },
      x: {
        title: {
          display: true,
          text: "Chapters", // Adding title for X-Axis
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg h-96">
      <h2 className="text-lg font-semibold mb-2">Student Performance Over Time</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
