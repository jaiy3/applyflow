import {
  FiBriefcase,
  FiActivity,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";

const icons = {
  Applications: <FiBriefcase />,
  Active: <FiActivity />,
  "Response Rate": <FiTrendingUp />,
  "Offer Rate": <FiAward />,
};

export default function StatsCard({
  title,
  value,
  subtitle,
}) {
  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-icon">
          {icons[title]}
        </div>

        <h3>{title}</h3>
      </div>

      <h2>{value}</h2>

      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}