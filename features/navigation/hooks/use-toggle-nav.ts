import { useState, useCallback } from 'react';

export default function useToggleNav(): [boolean, () => void, () => void] {
  const [open, setOpen] = useState(false);

  const closeNav = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const openNav = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  return [open, closeNav, openNav];
}
