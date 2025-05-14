type TableRowProps<T> = {
  row: T;
  columns: (keyof T)[];
};

export default function TableRow<T>({ row, columns }: TableRowProps<T>) {
  return (
    <tr>
      {columns.map((col, index) => (
        <td key={String(col) + index}>
          {String(row[col] ?? '')}
        </td>
      ))}
    </tr>
  );
}
