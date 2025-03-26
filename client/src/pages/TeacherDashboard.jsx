import React, { useState } from "react";
import LineChart from "../components/LineChart";
import BarChart from "../components/BarChart";

const TeacherDashboard = () => {
  // Mock data for multiple students
  const students = {
    "John Doe": { scores: [72, 78, 85, 90] },
    "Jane Smith": { scores: [80, 85, 88, 92] },
    "Sam Brown": { scores: [65, 70, 75, 80] }, // Below threshold
    "Emily Davis": { scores: [55, 60, 58, 65] }, // Struggling student
  };

  // Threshold for struggling students
  const STRUGGLING_THRESHOLD = 65;

  // Compute the average score for each student
  const studentAverages = Object.entries(students).map(([name, student]) => ({
    name,
    avg: student.scores.reduce((sum, score) => sum + score, 0) / student.scores.length,
  }));

  // Compute the overall class average
  const classAvg = studentAverages.reduce((sum, student) => sum + student.avg, 0) / studentAverages.length;

  // Identify struggling students
  const strugglingStudents = studentAverages.filter(student => student.avg < STRUGGLING_THRESHOLD);

  // State to track selected student
  const [selectedStudent, setSelectedStudent] = useState("John Doe");

  // Get data for selected student
  const studentData = students[selectedStudent];
  const studentAvg = studentAverages.find(student => student.name === selectedStudent)?.avg;

  return (
    <div className="p-6 w-full text-center flex justify-center flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Individual Student Performance Dashboard</h1>
        <div className="w-[60vw]">

      {/* Dropdown for selecting a student */}
      <div className="flex mb-4 justify-center items-center">
        <label htmlFor="student-select" className="mr-4 block text-lg font-medium text-gray-700">Select Student:</label>
        <select
          id="student-select"
          className="mt-1 p-2 border rounded-md"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          {Object.keys(students).map((student) => (
            <option key={student} value={student}>{student}</option>
          ))}
        </select>
      </div>

      {/* Display graphs */}
<div className="grid md:grid-cols-2 gap-6">
  <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl">
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <LineChart studentData={studentData} />
    </div>
  </div>

  <div className="p-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl">
    <div className="p-4 bg-white rounded-lg shadow-lg">
      <BarChart studentScore={studentAvg} classAvg={classAvg} />
    </div>
  </div>
</div>


      {/* Struggling Students Section */}
      {strugglingStudents.length > 0 && (
        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Struggling Students Identified</h2>
          <ul>
            {strugglingStudents.map((student) => (
              <li key={student.name} className="mb-1">
                <strong>{student.name}</strong>: Average Score {student.avg.toFixed(2)}
                <p className="text-sm text-gray-600">
                  Recommended Action: Schedule a meeting with the student, assign extra practice, and monitor progress.
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
};

export default TeacherDashboard;
