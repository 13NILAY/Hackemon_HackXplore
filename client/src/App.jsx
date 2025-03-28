import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ExamDashboard from "./pages/Assessment/ExamDashboard";
import Exam from "./pages/Assessment/Exam";
import ExamReview from "./pages/Assessment/ExamReview";
import PDFUploader from "./components/PdfUploader";

import { UserProvider } from "./context/UserContext";
import CreateCourse from "./pages/CourseGen/CreateCourse";
import CourseDetails from "./pages/CourseGen/CourseDetails";
import MyCourses from "./pages/CourseGen/MyCourses";
import CourseAssessment from "./pages/CourseGen/CourseAssessment";
import ChapterDetails from "./pages/CourseGen/ChapterDetails";
import ChapterAssessment from "./pages/CourseGen/ChapterAssessment";

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/course/:courseId/course-assessment"
              element={<CourseAssessment />}
            />
            <Route path="/my-courses" element={<MyCourses />} />
            <Route path="/create-course" element={<CreateCourse />} />
            <Route path="/course/:courseId" element={<CourseDetails />} />
            <Route
              path="/course/:courseId/chapter/:chapterId"
              element={<ChapterDetails />}
            />
            <Route
              path="/course/:courseId/chapter/:chapterId/assessment"
              element={<ChapterAssessment />}
            />
            <Route path="/assessment/:examId" element={<Exam />} />
            <Route path="/assessment" element={<ExamDashboard />} />
            <Route path="/examreview" element={<ExamReview />} />
            <Route path="/pdf-uploader" element={<PDFUploader />} />
            if(useUser().user.role==='student')
            {
              <>
                <Route path="/student" element={<StudentLayout />}>
                  <Route index element={<Navigate replace to="dashboard" />} />
                  <Route path="dashboard" element={<StudentDashboard />} />
                </Route>
              </>
            }
            if(useUser().user.role==='teacher')
            {
              <>
                <Route path="/teacher" element={<TeacherLayout />}>
                  <Route index element={<Navigate replace to="dashboard" />} />
                  <Route path="dashboard" element={<TeacherDashboard />} />
                  <Route
                    path="student-analysis"
                    element={<StudentAnalysis />}
                  />
                  <Route path="class-analysis" element={<ClassAnalysis />} />
                  <Route path="assignments" element={<Assignments />} />
                  <Route
                    path="assignments/:id/submissions"
                    element={<Submissions />}
                  />
                </Route>
              </>
            }
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
