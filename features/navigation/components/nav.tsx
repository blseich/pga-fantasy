import getProfileLink from '@/utils/db/get-profile-link';
import { NavProvider } from './nav-context';
import NavToggle from './nav-toggle';
import NavDrawer from './nav-drawer';

export default async function Nav() {
  return (
    <NavProvider profileLink={await getProfileLink()}>
      <NavToggle />
      <NavDrawer />
    </NavProvider>
  );
}
