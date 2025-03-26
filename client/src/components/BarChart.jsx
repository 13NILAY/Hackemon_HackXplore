import React, { useRef, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title);

const BarChart = ({ studentScore, classAvg }) => {
  const chartRef = useRef(null);
  const [gradientGood, setGradientGood] = useState(null);
  const [gradientBad, setGradientBad] = useState(null);
  const THRESHOLD = 65; // Define struggling threshold

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      const ctx = chart.ctx;

      // Green Gradient for Good Performance
      const goodGrad = ctx.createLinearGradient(0, 0, 0, 400);
      goodGrad.addColorStop(0, "#28a745"); // Green
      goodGrad.addColorStop(1, "rgba(40, 167, 69, 0.1)"); // Light Green

      // Red Gradient for Struggling Students
      const badGrad = ctx.createLinearGradient(0, 0, 0, 400);
      badGrad.addColorStop(0, "#dc3545"); // Red
      badGrad.addColorStop(1, "rgba(220, 53, 69, 0.1)"); // Light Red

      setGradientGood(goodGrad);
      setGradientBad(badGrad);
    }
  }, []);

  const studentColor = studentScore >= THRESHOLD ? gradientGood || "#28a745" : gradientBad || "#dc3545";
  const classColor = "#36A2EB"; // Keep class average in blue

  const data = {
    labels: ["Student Score", "Class Average"],
    datasets: [
      {
        label: "Performance Comparison",
        data: [studentScore, classAvg],
        backgroundColor: [studentColor, classColor],
        borderColor: [studentScore >= THRESHOLD ? "#28a745" : "#dc3545", "#36A2EB"],
        borderWidth: 1,
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
          text: "Score",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg h-96">
      <h2 className="text-lg font-semibold mb-2">Student vs Class Performance</h2>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default BarChart;
