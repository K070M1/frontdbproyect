import styles from './SelectField.module.css';

type Option = {
  value: string | number;
  label: string;
};

type SelectFieldProps = {
  label: string;
  name: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export default function SelectField({ label, name, value, options, onChange }: SelectFieldProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <select name={name} value={value} onChange={onChange} className={styles.select}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
