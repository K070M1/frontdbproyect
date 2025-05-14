import styles from './DetailView.module.css';

type DetailViewProps = {
  title: string;
  fields: { label: string; value: string | number | boolean }[];
};

export default function DetailView({ title, fields }: DetailViewProps) {
  return (
    <div className={styles.detailView}>
      <h2>{title}</h2>
      <dl>
        {fields.map((field, index) => (
          <div key={index} className={styles.field}>
            <dt>{field.label}:</dt>
            <dd>{String(field.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
