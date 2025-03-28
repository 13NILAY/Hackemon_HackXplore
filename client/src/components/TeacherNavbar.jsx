import { Bell, UserCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const TeacherNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Map route paths to readable page names
  const pageNames = {
    "/teacher": "Home",
    "/teacher/student-analysis": "Student Analysis",
    "/teacher/class-analysis": "Class Analysis",
    "/teacher/course": "Courses",
    "/teacher/assignments": "Assignments",
  };

  // Get current page title
  const currentPage = pageNames[location.pathname] || "Dashboard";

  return (
    <div className="flex items-center justify-between bg-white shadow-md px-6 py-4 fixed top-0 left-64 right-0 z-10">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-800">{currentPage}</h1>

      {/* Icons - Notifications & Profile */}
      <div className="flex items-center space-x-6">
        <button className="relative">
          <Bell size={24} className="text-gray-700 hover:text-blue-500" />
          {/* Notification Badge (optional) */}
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center cursor-pointer" onClick={()=>navigate("/teacher")}>
          <UserCircle size={32} className="text-gray-700 hover:text-blue-500" />
        </button>
      </div>
    </div>
  );
};

export default TeacherNavbar;
