export default function ShareButton({ onClick, ariaLabel = "Teilen" }) {
  return (
    <button onClick={onClick} className="share-btn" aria-label={ariaLabel}>
      Teilen
    </button>
  );
}
