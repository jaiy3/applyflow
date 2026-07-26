export default function ApplicationsTable({
  applications,
  onEdit,
  onDelete,
}) {
  return (
    <table className="applications-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>Job Title</th>
          <th>Status</th>
          <th>Deadline</th>
          <th>Job Link</th>
          <th>Notes</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {applications.length === 0 ? (
          <tr>
            <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
              No applications found.
            </td>
          </tr>
        ) : (
          applications.map((application) => (
            <tr key={application.id}>
              <td>{application.company}</td>

              <td>{application.jobTitle}</td>

              <td>
                <span
                  className={`status-badge ${application.status.toLowerCase()}`}
                >
                  {application.status}
                </span>
              </td>

              <td>
                {application.deadline
                  ? new Date(application.deadline).toLocaleDateString()
                  : "—"}
              </td>

              <td>
                {application.jobUrl ? (
                  <a
                    href={application.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                ) : (
                  "—"
                )}
              </td>

              <td>
                {application.notes
                  ? application.notes.length > 40
                    ? application.notes.slice(0, 40) + "..."
                    : application.notes
                  : "—"}
              </td>

              <td>
                <div className="action-buttons">
                  <button
                    className="edit-btn"
                    onClick={() => onEdit(application)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => onDelete(application.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}