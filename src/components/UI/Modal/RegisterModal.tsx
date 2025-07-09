"use client";

import React from 'react';
import styles from './RegisterModal.module.css';

type RegisterModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export default function RegisterModal({ isOpen, children, onClose }: RegisterModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Cerrar">
          ×
        </button>
        {children}
      </div>
    </div>
  );
}