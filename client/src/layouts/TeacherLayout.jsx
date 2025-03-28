import { Outlet } from "react-router-dom";
import Sidebar from "../components/TeacherSidebar";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherNavbar from "@/components/TeacherNavbar";

const TeacherLayout = () => {
  return (
    <div className="flex">
      {/* Sidebar remains fixed */}
      <TeacherSidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar at the top */}
        <TeacherNavbar />

        {/* Page Content */}
        <div className="p-6 mt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default TeacherLayout;
