import { fireEvent, render, screen } from '@/testing/test-utils';

import LoginErrorNotification from '../login-error-notification';

test('renders a closeable sign in error notification', () => {
  render(<LoginErrorNotification message="Invalid login credentials" />);

  expect(screen.getByRole('alert')).toBeInTheDocument();
  expect(screen.getByText('Sign in failed')).toBeInTheDocument();
  expect(screen.getByText('Invalid login credentials')).toBeInTheDocument();

  fireEvent.click(
    screen.getByRole('button', { name: /dismiss sign in error/i }),
  );

  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});
