import TeacherSidebar from "@/components/TeacherSidebar";
import React from "react";


const TeacherDashboard = () => {
  return (
    <div className="flex">
      <TeacherSidebar />
      <div className="flex-1 p-10">Teacher Dashboard</div>
    </div>
  );
};

export default TeacherDashboard;
