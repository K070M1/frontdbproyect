"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    return { href, label };
  });

  return (
    <nav className={styles.breadcrumbs}>
      <Link href="/">Inicio</Link>
      {breadcrumbs.map((crumb, index) => (
        <span key={index} className={styles.crumb}>
          <span className={styles.separator}>/</span>
          <Link href={crumb.href}>{crumb.label}</Link>
        </span>
      ))}
    </nav>
  );
}
