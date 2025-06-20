'use client';

import { createContext, PropsWithChildren, useEffect } from 'react';
import useToggleNav from '../hooks/use-toggle-nav';
import { usePathname } from 'next/navigation';

export const NavContext = createContext({
  profileLink: '',
  open: false,
  closeNav: () => {},
  openNav: () => {},
});

export const NavProvider = ({
  profileLink,
  children,
}: PropsWithChildren<{ profileLink: string }>) => {
  const pathname = usePathname();
  const [open, closeNav, openNav] = useToggleNav();

  useEffect(() => {
    closeNav();
  }, [closeNav, pathname]);

  return (
    <NavContext.Provider
      value={{
        open,
        closeNav,
        openNav,
        profileLink,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};
