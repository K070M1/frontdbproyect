import { useMemo, useState } from "react";

export function useSelectableList<T extends { id: string }>(data: T[] = []) {
  const list = useMemo(() => data || [], [data]);
  const [active, setActive] = useState<{ id: string; data: T | null }>({
    id: "",
    data: null,
  });

  const setById = (id: string) => {
    const found = list.find((item) => item.id === id) || null;
    setActive({ id, data: found });
  };

  return { list, active, setActive, setById };
}
