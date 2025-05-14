import styles from './FilterPanel.module.css';

type FilterPanelProps = {
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
};

export default function FilterPanel({ filters, activeFilter, onFilterChange }: FilterPanelProps) {
  return (
    <div className={styles.panel}>
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`${styles.button} ${activeFilter === filter ? styles.active : ''}`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
