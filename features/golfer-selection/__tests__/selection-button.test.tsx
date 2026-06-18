import { fireEvent, render, screen, waitFor } from '@/testing/test-utils';
import SelectionButton from '../components/selection-button';

const push = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/ball.svg', () => ({
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="ball-svg" />
  ),
}));

vi.mock('@/club.svg', () => ({
  default: ({ className }: { className?: string }) => (
    <div className={className} data-testid="club-svg" />
  ),
}));

const renderSelectionButton = () =>
  render(
    <SelectionButton
      golfer_id="golfer-1"
      bucket="1-10"
      rank="1"
      redirectHref="/user/public-id"
    />,
  );

afterEach(() => {
  vi.restoreAllMocks();
  push.mockClear();
});

test('redirects after a successful pick request', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response),
  );

  renderSelectionButton();
  fireEvent.click(screen.getByRole('button', { name: 'Select golfer' }));

  await waitFor(() => {
    expect(push).toHaveBeenCalledWith('/user/public-id');
  });
  expect(global.fetch).toHaveBeenCalledWith('/pick', {
    method: 'POST',
    body: JSON.stringify({
      golfer_id: 'golfer-1',
      rank_bucket: '1-10',
      dg_rank: '1',
    }),
  });
});

test('resets loading and shows a message when the pick request fails', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () =>
        Promise.resolve({
          success: false,
          error: { message: 'Picks are locked for this tournament.' },
        }),
    } as Response),
  );

  renderSelectionButton();
  fireEvent.click(screen.getByRole('button', { name: 'Select golfer' }));

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  expect(
    await screen.findByText('Picks are locked for this tournament.'),
  ).toBeInTheDocument();
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  expect(push).not.toHaveBeenCalled();
});

test('resets loading and shows a network message when fetch rejects', async () => {
  global.fetch = vi.fn(() => Promise.reject(new Error('Network down')));

  renderSelectionButton();
  fireEvent.click(screen.getByRole('button', { name: 'Select golfer' }));

  expect(
    await screen.findByText('Unable to reach the server. Please try again.'),
  ).toBeInTheDocument();
  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  expect(push).not.toHaveBeenCalled();
});
