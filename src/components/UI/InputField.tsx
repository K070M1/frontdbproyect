import styles from './InputField.module.css';

type InputFieldProps = {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  step?: number;
};

export default function InputField({
  label,
  name,
  value,
  type = 'text',
  onChange,
  min,
  max,
  step,
}: InputFieldProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={styles.input}
        {...(min !== undefined ? { min } : {})}
        {...(max !== undefined ? { max } : {})}
        {...(step !== undefined ? { step } : {})}
      />
    </div>
  );
}
