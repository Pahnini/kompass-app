export default function DeleteButton({ onDelete, ariaLabel = "Löschen" }) {
  // Return null if no delete function provided
  if (!onDelete) {
    return null;
  }

  // Return the button when props are valid
  return (
    <button className="delete-btn" aria-label={ariaLabel} onClick={onDelete}>
      ✖
    </button>
  );
}
