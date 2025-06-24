export default function DeleteButton({ onDelete, ariaLabel = "Löschen" }) {
<<<<<<< HEAD
=======
  // Return null if no delete function provided
>>>>>>> 40c7e75 (Refactor components: replace back button implementation in DeinWeg, Guide, and Skills with BackButton component; add DeleteButton component for improved delete functionality and UI consistency.)
  if (!onDelete) {
    return null;
  }

<<<<<<< HEAD
  return (
    <button onClick={onDelete} className="delete-btn" aria-label={ariaLabel}>
=======
  // Return the button when props are valid
  return (
    <button className="delete-btn" aria-label={ariaLabel} onClick={onDelete}>
>>>>>>> 40c7e75 (Refactor components: replace back button implementation in DeinWeg, Guide, and Skills with BackButton component; add DeleteButton component for improved delete functionality and UI consistency.)
      ✖
    </button>
  );
}
