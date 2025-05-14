import styles from './Table.module.css';
import TableRow from './TableRow';

type TableProps<T> = {
  headers: string[];
  columns: (keyof T)[];
  data: T[];
};

export default function Table<T>({ headers, columns, data }: TableProps<T>) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <TableRow key={index} row={row} columns={columns} />
        ))}
      </tbody>
    </table>
  );
}
