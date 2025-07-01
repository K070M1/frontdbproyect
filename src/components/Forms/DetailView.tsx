import styles from './DetailView.module.css';

type DetailViewProps = {
  title: string;
  fields: { label: string; value: string | number | boolean | null }[];
};

export default function DetailView({ title, fields }: DetailViewProps) {
  return (
    <div className={styles.detailView}>
      <h2 className={styles.title}>{title}</h2>
      <dl className={styles.list}>
        {fields.map((field, index) => (
          <div key={index} className={styles.field}>
            <dt className={styles.label}>{field.label}:</dt>
            <dd className={styles.value}>
              {field.value !== null ? String(field.value) : "No disponible"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
