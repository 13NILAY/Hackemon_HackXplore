import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ performanceData }) => {
  const totalStudents = performanceData.reduce((a, b) => a + b, 0); // Calculate total students

  const data = {
    labels: ["Excellent (85+)", "Good (70-84)", "Average (50-69)", "Needs Improvement (<50)"],
    datasets: [
      {
        data: performanceData,
        backgroundColor: ["green", "blue", "yellow", "red"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            let value = tooltipItem.raw; // Get number of students
            let percentage = ((value / totalStudents) * 100).toFixed(1); // Calculate %
            return `${value} students (${percentage}%)`; // Show count + percentage
          },
        },
      },
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className=" bg-white shadow-lg rounded-lg h-[410px]">
    <div className="p-4 bg-white rounded-lg h-96">
      <h2 className="text-lg font-semibold mb-2">Student Performance Distribution</h2>
      <Pie data={data} options={options} />
    </div>
    </div>
  );
};

export default PieChart;
