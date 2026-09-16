interface SelectionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function SelectionChip({ label, selected, onClick }: SelectionChipProps) {
  return (
    <button
      onClick={onClick}
      className={`selection-chip ${selected ? 'selection-chip-selected' : ''}`}
    >
      {selected && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
      <span>{label}</span>
    </button>
  );
}
