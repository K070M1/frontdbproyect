"use client";

import { FaSearch } from "react-icons/fa";
import styles from "./SearchButton.module.css";

type Props = {
  onClick?: () => void;
};

export default function SearchButton({ onClick }: Props) {
  return (
    <button
      className={styles.iconButton}
      aria-label="Buscar"
      onClick={onClick}
    >
      <FaSearch />
    </button>
  );
}
