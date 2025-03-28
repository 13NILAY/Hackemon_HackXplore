import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const {setUser} =useUser();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");
      const {user,token } = data;
      console.log(data);

      // Assuming the response contains a 'role' field (student/teacher)
       localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);

      if (user.role === "student") {
        navigate("/student-dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        setError("Invalid role. Please contact support.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="relative bg-white p-2 rounded-xl shadow-lg w-96 border border-transparent">
        <div className="absolute inset-0 rounded-xl border-[2px] border-transparent bg-gradient-to-r from-purple-500 to-blue-500 p-[1.5px]"></div>
        <div className="relative bg-white p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white p-3 rounded-lg text-lg font-semibold hover:opacity-90 transition">
              Login
            </button>
          </form>
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-purple-500 font-semibold">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
