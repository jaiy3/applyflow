import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="center-page">

      <h1>ApplyFlow</h1>

      <p>

        Organise all your job applications in one place.

      </p>

      <div className="button-row">

        <Link to="/login">

          Login

        </Link>

        <Link to="/register">

          Register

        </Link>

      </div>

    </div>
  );
}