// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  localStorage.clear();

  try {
    const res = await api.post("/auth/login", { username, password });
    console.log("Login Response:", res.data); // ✅ Debug

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } else {
      alert("Login failed: Token missing in response");
    }
  } catch (err: any) {
    console.error("Login Error:", err);
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div style={{ padding: "20px" }} className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Login</button>
      </form>
        <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}

export default Login;
