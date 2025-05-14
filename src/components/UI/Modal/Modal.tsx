import styles from './Modal.module.css';

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onClose: () => void;
};

export default function Modal({ isOpen, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}
