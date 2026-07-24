import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";
import ApplicationsTable from "../../components/applications/ApplicationsTable";
import AddApplicationForm from "../../components/dashboard/AddApplicationForm";
import {
  getApplications,
  deleteApplication,
} from "../../services/applicationService";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [editingApplication, setEditingApplication] = useState(null);
  const handleEditComplete = () => {setEditingApplication(null);};
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchApplications = async () => {
  try {
    const data = await getApplications({
      search,
      status: status || undefined,
      sortBy,
      sortOrder,
    });

    setApplications(data.applications);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchApplications();
}, [search, status, sortBy, sortOrder]);

  const handleEdit = (application) => {
  setEditingApplication(application);
  };

  const handleDelete = async (id) => {
  try {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

  await deleteApplication(id);
  await fetchApplications();

  } catch (error) {
    console.error(error);

    alert("Failed to delete application.");
  }
};

  return (
    <DashboardLayout>
      <h1>Applications</h1>

      <p>Manage all your job applications here.</p>

      <AddApplicationForm
        onApplicationCreated={fetchApplications}
        editingApplication={editingApplication}
        onEditComplete={handleEditComplete}
      />

     <div className="controls">
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search by company or job title..."
      value={search}
      onChange={(event) => setSearch(event.target.value)}
    />
  </div>

  <div className="filter-bar">
    <select
      value={status}
      onChange={(event) => setStatus(event.target.value)}
    >
      <option value="">All Statuses</option>
      <option value="SAVED">Saved</option>
      <option value="APPLIED">Applied</option>
      <option value="INTERVIEW">Interview</option>
      <option value="OFFER">Offer</option>
      <option value="REJECTED">Rejected</option>
      <option value="WITHDRAWN">Withdrawn</option>
    </select>
  </div>

  <div className="sort-bar">
    <select
      value={`${sortBy}-${sortOrder}`}
      onChange={(event) => {
        const [field, order] = event.target.value.split("-");
        setSortBy(field);
        setSortOrder(order);
      }}
    >
      <option value="createdAt-desc">Newest First</option>
      <option value="createdAt-asc">Oldest First</option>
      <option value="company-asc">Company A–Z</option>
      <option value="company-desc">Company Z–A</option>
    </select>
  </div>
</div>

      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <>
            <p>{applications.length} application(s) found.</p>

          <div className="table-card">
            <ApplicationsTable
              applications={applications}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            </div>
        </>
      )}
    </DashboardLayout>
  );
}