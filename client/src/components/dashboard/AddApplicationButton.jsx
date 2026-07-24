export default function AddApplicationButton({
  onClick,
}) {
  return (
    <button
      className="add-application-button"
      onClick={onClick}
    >
      + Add Application
    </button>
  );
}