import { Outlet } from "react-router-dom";
import StudentSidebar from "@/components/StudentSidebar";
import StudentNavbar from "@/components/StudentNavbar";
import Chatbot from "@/components/Chatbot"; // Import chatbot

const StudentLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar remains fixed */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar at the top */}
        <StudentNavbar />

        {/* Page Content */}
        <div className="p-6 mt-16">
          <Outlet />
        </div>
      </div>

      {/* Floating Chatbot */}
      <div className="fixed bottom-6 right-6">
        <Chatbot />
      </div>
    </div>
  );
};

export default StudentLayout;
