import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();

      toast.success("Logged out successfully.");

      navigate("/login");
    } catch {
      toast.error("Unable to log out.");
    }
  }

  return (
    <header className="navbar">
      <div>
        <h2>ApplyFlow</h2>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <span>
          Welcome back, <strong>{user?.firstName}</strong> 👋
        </span>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
}