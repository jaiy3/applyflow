export default function RecentApplications({
  applications,
}) {
  return (
    <div className="dashboard-section">
      <h2>Recent Applications</h2>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <ul className="dashboard-list">
          {applications.map((application) => (
            <li key={application.id}>
              <strong>{application.company}</strong>

              <br />

              {application.jobTitle}

              <br />

              <small>{application.status}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}