import { NavLink } from "react-router-dom";
import { Home, Users, BarChart, Book, ClipboardList, LogOut } from "lucide-react"; // Importing icons
import { useNavigate } from "react-router-dom";

const TeacherSidebar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        // Remove authentication token (Modify as per your auth implementation)
        localStorage.removeItem("authToken"); 
        localStorage.removeItem("user"); 
        // Redirect to login page
        navigate("/");
      };
  return (
    <div className="w-64 h-screen bg-white text-black fixed top-0 left-0 shadow-lg flex flex-col justify-between">
      {/* Sidebar Menu */}
      <div>
        <div className="p-4 text-2xl font-bold text-center text-blue-700">App name</div>
        <ul className="space-y-0.5 p-4">
          <li>
            <NavLink
              to="/teacher"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 p-4 text-lg rounded transition font-semibold ${
                  isActive ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <Home size={20} /> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/teacher/student-analysis"
              className={({ isActive }) =>
                `flex items-center gap-3 p-4 text-lg rounded transition font-semibold ${
                  isActive ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <Users size={20} /> Student Analysis
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/teacher/class-analysis"
              className={({ isActive }) =>
                `flex items-center gap-3 p-4 text-lg rounded transition font-semibold ${
                  isActive ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <BarChart size={20} /> Class Analysis
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/teacher/course"
              className={({ isActive }) =>
                `flex items-center gap-3 p-4 text-lg rounded transition font-semibold ${
                  isActive ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <Book size={20} /> Course
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/teacher/assignments"
              className={({ isActive }) =>
                `flex items-center gap-3 p-4 text-lg rounded transition font-semibold ${
                  isActive ? "bg-blue-100 text-blue-700 font-bold" : "hover:bg-blue-700 hover:text-white"
                }`
              }
            >
              <ClipboardList size={20} /> Assignments
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Logout Button */}
      <div className="p-4 text-center flex items-center justify-center">
        <button
          onClick={handleLogout} // Replace with logout logic
          className="flex justify-center items-center gap-3 w-full p-4 text-lg rounded  text-blue-700 font-semibold hover:bg-blue-200 text-center cursor-pointer transition"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default TeacherSidebar;
