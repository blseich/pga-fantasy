import { fireEvent, render, screen } from '@/testing/test-utils';
import ClientErrorPopup from '../client-error-popup';

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

test('renders the error message with refresh and report actions', async () => {
  const onRefresh = vi.fn();

  render(
    <ClientErrorPopup
      message="Unable to save your pick right now."
      onRefresh={onRefresh}
      reportEmail="errors@example.com"
    />,
  );

  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(
    screen.getByText('Unable to save your pick right now.'),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /try again/i }));
  expect(onRefresh).toHaveBeenCalledOnce();

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
        message: 'Unable to save your pick right now.',
        page: window.location.href,
      }),
    }),
  );
});

test('shows fallback instructions when automated reporting fails', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () => Promise.resolve({ success: false }),
    } as Response),
  );

  render(
    <ClientErrorPopup
      message="Unable to save right now."
      reportEmail="errors@example.com"
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: /report/i }));

  expect(
    await screen.findByText(
      /Sorry, but we cannot send the automated report at this time./,
    ),
  ).toBeInTheDocument();
  expect(screen.getByText(/errors@example.com/)).toBeInTheDocument();
});

test('shows a rate-limit message when the report endpoint throttles the request', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: false,
      json: () =>
        Promise.resolve({
          success: false,
          error: { code: 'ERROR_REPORT_RATE_LIMITED' },
        }),
    } as Response),
  );

  render(
    <ClientErrorPopup
      message="Unable to save right now."
      reportEmail="errors@example.com"
    />,
  );

  fireEvent.click(screen.getByRole('button', { name: /report/i }));

  expect(
    await screen.findByText(
      'Please wait a minute before sending another automated report.',
    ),
  ).toBeInTheDocument();
});
