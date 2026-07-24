import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>ApplyFlow</h2>

      <nav>
        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/applications">
          Applications
        </Link>
      </nav>
    </aside>
  );
}