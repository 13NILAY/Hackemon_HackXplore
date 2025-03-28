import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { Bot } from "lucide-react";

const assignmentDetails = {
  1: { name: "Math Assignment", description: "Solve the given algebraic equations." },
  2: { name: "Science Project", description: "Prepare a presentation on renewable energy." },
  3: { name: "History Essay", description: "Write an essay on World War II." },
};

const submissionsData = {
  1: [
    {
      student: "Aarav Sharma",
      submittedOn: "2025-03-26",
      status: "On Time",
      document: "https://example.com/aarav_assignment.pdf",
      grade: ""
    },
    {
      student: "Meera Iyer",
      submittedOn: "2025-03-26",
      status: "Late",
      document: "https://example.com/meera_assignment.docx",
      grade: ""
    },
  ],
};

const Submissions = () => {
  const { id } = useParams();
  const [grades, setGrades] = useState({});

  const assignment = assignmentDetails[id] || { name: "Unknown", description: "No details available." };
  const submissions = submissionsData[id] || [];

  const handleGradeChange = (student, event) => {
    setGrades({ ...grades, [student]: event.target.value });
  };

  const handleAiEvaluation = (student) => {
    alert(`AI is evaluating ${student}'s submission...`);
  };

  return (
    <div className="p-6">
      <Link to="/teacher/assignments" className="text-blue-600 mb-4 inline-block">
        ← Back to Assignments
      </Link>
      <h2 className="text-2xl font-bold mb-2">{assignment.name}</h2>
      <p className="text-gray-700 mb-4">{assignment.description}</p>
      
      
      <div className="bg-white shadow-lg rounded">
        {submissions.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-100 rounded-md">
                <th className="p-3 rounded-l-md">Student</th>
                <th className="p-3">Submitted On</th>
                <th className="p-3">Status</th>
                <th className="p-3">Document</th>
                <th className="p-3">Grade</th>
                <th className="p-3 rounded-r-md">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{submission.student}</td>
                  <td className="p-3">{submission.submittedOn}</td>
                  <td className={`p-3 font-semibold ${
                    submission.status === "On Time" ? "text-green-600" : 
                    submission.status === "Pending" ? "text-yellow-600" : "text-red-600"}`}
                  >
                    {submission.status}
                  </td>
                  <td className="p-3">
                    {submission.document ? (
                      <a href={submission.document} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                        View Document
                      </a>
                    ) : (
                      <span className="text-gray-500">No document</span>
                    )}
                  </td>
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={grades[submission.student] || ""} 
                      onChange={(event) => handleGradeChange(submission.student, event)} 
                      className="border rounded px-2 py-1 w-16 text-center"
                      placeholder="Grade"
                    />
                  </td>
                  <td className="p-3">
                    <button 
                      onClick={() => handleAiEvaluation(submission.student)} 
                      className="flex justify-center items-center gap-2 bg-purple-100 text-purple-700 border-2 border-purple-700 px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                    <Bot size={16} />
                      AI Evaluate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Submissions;
