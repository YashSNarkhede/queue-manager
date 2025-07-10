import { Link } from "react-router-dom";

function Header() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header style={{ padding: "10px", background: "#f0f0f0", display: "flex", justifyContent: "space-between" }}>
      <h2>Queue Manager</h2>
      <nav>
        <button onClick={handleLogout}>Logout</button>
      </nav>
    </header>
  );
}

export default Header;
