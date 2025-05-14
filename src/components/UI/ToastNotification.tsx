import styles from './ToastNotification.module.css';

type ToastNotificationProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
};

export default function ToastNotification({ message, type = 'info' }: ToastNotificationProps) {
  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      {message}
    </div>
  );
}
