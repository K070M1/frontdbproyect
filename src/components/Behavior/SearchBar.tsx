"use client";

import styles from "./SearchBar.module.css";

type SearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  return (
    <div className={styles.container}>
      <input
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Buscar..."
        className={styles.searchInput}
      />
    </div>
  );
}
