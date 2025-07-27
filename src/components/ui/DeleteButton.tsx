type DeleteButtonProps = {
  onDelete: () => void;
  ariaLabel?: string;
};

export default function DeleteButton({ onDelete, ariaLabel = 'Löschen' }: DeleteButtonProps) {
  if (!onDelete) {
    return null;
  }

  return (
    <button className="delete-btn" aria-label={ariaLabel} onClick={onDelete}>
      ✖
    </button>
  );
}
