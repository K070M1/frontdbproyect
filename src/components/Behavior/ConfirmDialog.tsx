import styles from './ConfirmDialog.module.css';

type ConfirmDialogProps = {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({ message, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirmar
          </button>
          <button className={styles.cancelButton} onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
