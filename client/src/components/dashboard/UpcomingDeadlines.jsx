export default function UpcomingDeadlines({
  deadlines,
}) {
  return (
    <div className="dashboard-section">
      <h2>Upcoming Deadlines</h2>

      {deadlines.length === 0 ? (
        <p>No upcoming deadlines.</p>
      ) : (
        <ul className="dashboard-list">
          {deadlines.map((application) => (
            <li key={application.id}>
              <strong>{application.company}</strong>

              <br />

              {application.jobTitle}

              <br />

              <small>
                {new Date(
                  application.deadline
                ).toLocaleDateString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}