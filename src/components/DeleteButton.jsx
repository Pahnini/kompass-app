export default function DeleteButton({ onDelete, ariaLabel = "Löschen" }) {
  if (!onDelete) {
    return null;
  }

  return (
    <button className="delete-btn" aria-label={ariaLabel} onClick={onDelete}>
      ✖
    </button>
  );
}
