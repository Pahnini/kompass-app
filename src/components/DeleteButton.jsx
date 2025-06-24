export default function DeleteButton({ onDelete, ariaLabel = "Löschen" }) {
  if (!onDelete) {
    return null;
  }

  return (
    <button onClick={onDelete} className="delete-btn" aria-label={ariaLabel}>
      ✖
    </button>
  );
}
