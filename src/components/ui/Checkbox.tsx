import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  indeterminate?: boolean;
  size?: 'sm' | 'md';
}

export function Checkbox({
  checked,
  onChange,
  label,
  indeterminate = false,
  size = 'md',
}: CheckboxProps) {
  return (
    <label className={`${styles.wrapper} ${styles[size]}`}>
      <span
        className={`${styles.box} ${checked ? styles.checked : ''} ${indeterminate ? styles.indeterminate : ''}`}
        role="checkbox"
        aria-checked={indeterminate ? 'mixed' : checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            onChange(!checked);
          }
        }}
      >
        {indeterminate ? (
          <svg viewBox="0 0 12 12" fill="none">
            <line
              x1="2"
              y1="6"
              x2="10"
              y2="6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : checked ? (
          <svg viewBox="0 0 12 12" fill="none">
            <polyline
              points="2,6 5,9 10,3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
