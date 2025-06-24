export default function DeleteButton({ onDelete, ariaLabel = "Löschen" }) {
  if (!onDelete) {
    return null;
  }

  return (
    <button className="delete-btn" aria-label={ariaLabel} onClick={onDelete}>
>>>>>>> 40c7e75 (Refactor components: replace back button implementation in DeinWeg, Guide, and Skills with BackButton component; add DeleteButton component for improved delete functionality and UI consistency.)
      ✖
    </button>
  );
}
