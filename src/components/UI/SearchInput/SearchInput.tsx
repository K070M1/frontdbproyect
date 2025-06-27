"use client";

import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import styles from "./SearchInput.module.css";

type Props = {
  placeholder?: string;
  onSearch: (query: string) => void;
};

export default function SearchInput({ placeholder = "Buscar...", onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchWrapper}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className={styles.iconButton} aria-label="Buscar">
        <FaSearch />
      </button>
    </form>
  );
}
