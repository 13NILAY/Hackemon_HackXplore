import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentAnalysis from "./components/StudentAnalysis";
import ClassAnalysis from "./components/ClassAnalysis";
import TeacherLayout from "./layouts/TeacherLayout";
import Assignments from "./pages/Assignments";
import Submissions from "./pages/Submissions";
import StudentLayout from "./layouts/StudentLayout";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Teacher Routes inside a Persistent Layout */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="student-analysis" element={<StudentAnalysis />} />
          <Route path="class-analysis" element={<ClassAnalysis />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="assignments/:id/submissions" element={<Submissions />} />
        </Route>

         {/* Student Routes inside a Persistent Layout */}
         <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate replace to="dashboard" />} />
          <Route path="dashboard" element={<StudentDashboard />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
