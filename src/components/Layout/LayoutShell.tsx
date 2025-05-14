import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import styles from './LayoutShell.module.css';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.mainContainer}>
        <Sidebar />
        <main className={styles.content}>
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
}
