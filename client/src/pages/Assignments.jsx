import { useState } from "react";
import { Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const assignmentsData = [
  { id: 1, name: "Math Homework", description: "Algebra & Geometry exercises", createdDate: "2025-03-20", dueDate: "2025-03-26" },
  { id: 2, name: "Science Report", description: "Physics experiment analysis", createdDate: "2025-03-18", dueDate: "2025-03-25" },
  { id: 3, name: "History Essay", description: "World War II impact", createdDate: "2025-03-15", dueDate: "2025-03-24" },
];

const CreateAssignmentModal = ({ onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
    const [submissionFormat, setSubmissionFormat] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description || !dueDate) return;

    const newAssignment = {
      id: Date.now(),
      name,
      description,
      createdDate: new Date().toISOString().split("T")[0], // Current Date
      dueDate,
    };

    onCreate(newAssignment);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-10">
  <div className="bg-white p-6 rounded shadow-lg w-96 relative">
    {/* Close Button */}
    <button 
      className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 cursor-pointer"
      onClick={onClose}
    >
      ✖
    </button>

    <h3 className="text-xl font-bold mb-4">Create Assignment</h3>
    <form onSubmit={handleSubmit}>
      {/* Name Input */}
      <div className="mb-3">
        <label className="block font-medium">Name</label>
        <input 
          type="text" 
          className="w-full border p-2 rounded" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>

      {/* Description Input */}
      <div className="mb-3">
        <label className="block font-medium">Description</label>
        <textarea 
          className="w-full border p-2 rounded" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          required 
        />
      </div>

      {/* Due Date Input */}
      <div className="mb-3">
        <label className="block font-medium">Due Date</label>
        <input 
          type="date" 
          className="w-full border p-2 rounded" 
          value={dueDate} 
          onChange={(e) => setDueDate(e.target.value)} 
          required 
        />
      </div>

      {/* Submission Format Dropdown */}
      <div className="mb-3">
        <label className="block font-medium">Submission Format</label>
        <select 
          className="w-full border p-2 rounded" 
          value={submissionFormat} 
          onChange={(e) => setSubmissionFormat(e.target.value)}
          required
        >
          <option value="">Select Format</option>
          <option value="PDF">PDF</option>
          <option value="Word Document">Word Document</option>
          <option value="Google Docs">Google Docs</option>
          <option value="Text">Text</option>
          <option value="Code">Code</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2">
        {/* <button 
          type="button" 
          className="px-4 py-2 bg-gray-500 text-white rounded" 
          onClick={onClose}
        >
          Cancel
        </button> */}
        <button 
          type="submit" 
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded cursor-pointer"
        >
          Create
        </button>
      </div>
    </form>
  </div>
</div>

  );
};

const Assignments = () => {
  const [assignments, setAssignments] = useState(assignmentsData);
  const [showModal, setShowModal] = useState(false);

  const handleCreateAssignment = (newAssignment) => {
    setAssignments([...assignments, newAssignment]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Assignments</h2>
        <button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white  cursor-pointer px-4 py-2 rounded-md flex items-center gap-2">
          <Plus size={18} /> Create Assignment
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-md">
        <table className="w-full text-left rounded-md">
          <thead className="rounded-md bg-blue-100">
            <tr className="bg-blue-100 rounded-md">
              <th className="p-3 rounded-l-md">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Description</th>
              <th className="p-3">Created Date</th>
              <th className="p-3">Due Date</th>
              <th className="p-3 rounded-r-md">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((assignment) => (
              <tr key={assignment.id} className="border-t">
                <td className="p-3">{assignment.id}</td>
                <td className="p-3">{assignment.name}</td>
                <td className="p-3">{assignment.description}</td>
                <td className="p-3">{assignment.createdDate}</td>
                <td className="p-3">{assignment.dueDate}</td>
                <td className="p-3">
                  <Link to={`${assignment.id}/submissions`} className="text-blue-600 flex items-center gap-1">
                    <Eye size={18} /> View Submissions
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && <CreateAssignmentModal onClose={() => setShowModal(false)} onCreate={handleCreateAssignment} />}
    </div>
  );
};

export default Assignments;
