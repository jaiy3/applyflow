import RecentApplications from "../../components/dashboard/RecentApplications";
import UpcomingDeadlines from "../../components/dashboard/UpcomingDeadlines";

import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getStatistics } from "../../services/applicationService";
import StatsGrid from "../../components/dashboard/StatsGrid";
import useAuth from "../../hooks/useAuth";

import AddApplicationButton from "../../components/dashboard/AddApplicationButton";
import AddApplicationForm from "../../components/dashboard/AddApplicationForm";

export default function Dashboard() {
  const { user } = useAuth();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getStatistics();

        setDashboardData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      <h1>Welcome back, {user?.firstName}! 👋</h1>
  
      <p>
        Here's an overview of your job search.
      </p>

      <AddApplicationButton
        onClick={() => setShowForm(true)}
      />

      {showForm && (
        <AddApplicationForm
          onClose={() => setShowForm(false)}
        />
      )}

      {loading ? (
      <p>Loading dashboard...</p>
        ) : (
      <>
    <StatsGrid statistics={dashboardData.statistics} />

    <div className="dashboard-columns">
      <RecentApplications
        applications={dashboardData.recentApplications}
      />

      <UpcomingDeadlines
        deadlines={dashboardData.upcomingDeadlines}
      />
    </div>
  </>
)}
    </DashboardLayout>
  );
}