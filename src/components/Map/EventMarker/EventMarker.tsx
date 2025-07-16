import styles from './EventMarker.module.css';

type EventMarkerProps = {
  title: string;
};

export default function EventMarker({ title }: EventMarkerProps) {
  return <div className={styles.marker} title={title} />;
}
