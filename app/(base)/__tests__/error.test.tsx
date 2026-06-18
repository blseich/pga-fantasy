import { fireEvent, render, screen } from '@/testing/test-utils';
import ErrorPage from '../error';

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    } as Response),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('shows error details and sends a route error report', async () => {
  const reset = vi.fn();
  const error = new Error('PGA data is unavailable.') as Error & {
    digest?: string;
  };
  error.digest = 'digest-123';

  render(<ErrorPage error={error} reset={reset} />);

  expect(screen.getByText('PGA data is unavailable.')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /try again/i }));
  expect(reset).toHaveBeenCalledOnce();

  fireEvent.click(screen.getByRole('button', { name: /report/i }));

  expect(
    await screen.findByText(
      'Error report sent. Try refreshing the page when you are ready.',
    ),
  ).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith(
    '/error-report',
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({
        message: [
          'Route error boundary rendered.',
          'Message: PGA data is unavailable.',
          'Digest: digest-123',
        ].join('\n'),
        page: window.location.href,
      }),
    }),
  );
});
