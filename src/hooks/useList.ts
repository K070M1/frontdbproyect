import { useMemo, useState } from "react";

export function useSelectableList(data:any = []) {
  const list = useMemo(() => data || [], [data]);
  const [active, setActive] = useState({ id: "", data: null });

  const setById = (id:any) => {
    const found = list.find((item:any) => item._id === id);
    setActive({ id, data: found || null });
  };

  return { list, active, setActive, setById };
}