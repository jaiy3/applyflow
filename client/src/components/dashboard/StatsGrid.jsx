import StatsCard from "./StatsCard";

export default function StatsGrid({ statistics }) {
  if (!statistics) return null;

  return (
    <div className="stats-grid">
      <StatsCard
        title="Applications"
        value={statistics.totalApplications}
      />

      <StatsCard
        title="Active"
        value={statistics.activeApplications}
      />

      <StatsCard
        title="Response Rate"
        value={`${statistics.responseRate}%`}
      />

      <StatsCard
        title="Offer Rate"
        value={`${statistics.offerRate}%`}
      />
    </div>
  );
}