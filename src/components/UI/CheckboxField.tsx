import styles from './CheckboxField.module.css';

type CheckboxFieldProps = {
  label: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CheckboxField({ label, name, checked, onChange }: CheckboxFieldProps) {
  return (
    <div className={styles.container}>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} className={styles.input} />
      <label className={styles.label}>{label}</label>
    </div>
  );
}
