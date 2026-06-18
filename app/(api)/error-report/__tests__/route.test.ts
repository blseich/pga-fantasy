const mocks = vi.hoisted(() => ({
  authGetUser: vi.fn(),
  createClient: vi.fn(),
  send: vi.fn(),
}));

vi.mock('@/utils/supabase/server', () => ({
  createClient: mocks.createClient,
}));

vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: mocks.send,
    },
  })),
}));

import { POST } from '../route';
import { clearErrorReportRateLimitStore } from '../rate-limit';

const originalEnv = process.env;

const createErrorReportRequest = (body: unknown) =>
  new Request('http://localhost/error-report', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const readResponse = async (response: Response) => ({
  status: response.status,
  body: await response.json(),
});

beforeEach(() => {
  vi.resetAllMocks();
  vi.spyOn(console, 'error').mockImplementation(() => {});
  clearErrorReportRateLimitStore();
  mocks.authGetUser.mockResolvedValue({
    data: {
      user: {
        id: 'user-1',
        email: 'golfer@example.com',
      },
    },
    error: null,
  });
  mocks.createClient.mockResolvedValue({
    auth: { getUser: mocks.authGetUser },
  });
  process.env = {
    ...originalEnv,
    ERROR_REPORT_FROM: 'PGA Pick Em <errors@auth.pga-pickem.com>',
    ERROR_REPORT_TO: 'errors@auth.pga-pickem.com',
    RESEND_API_KEY: 're_test',
  };
  mocks.send.mockResolvedValue({ data: { id: 'email-1' }, error: null });
});

afterEach(() => {
  process.env = originalEnv;
  vi.restoreAllMocks();
  vi.resetAllMocks();
});

test.sequential('returns 400 when the report body is invalid', async () => {
  const response = await POST(createErrorReportRequest({ message: 'Error' }));

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 400,
    body: {
      success: false,
      error: { code: 'INVALID_ERROR_REPORT' },
    },
  });
});

test.sequential('returns 401 when the user is not authenticated', async () => {
  mocks.authGetUser.mockResolvedValueOnce({
    data: { user: null },
    error: { message: 'Not signed in' },
  });

  const response = await POST(
    createErrorReportRequest({
      message: 'Unable to save your pick right now.',
      page: 'http://localhost/user/test',
    }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 401,
    body: {
      success: false,
      error: { code: 'UNAUTHENTICATED_REPORT' },
    },
  });
});

test.sequential(
  'returns 500 when Resend environment variables are missing',
  async () => {
    delete process.env.RESEND_API_KEY;

    const response = await POST(
      createErrorReportRequest({
        message: 'Unable to save your pick right now.',
        page: 'http://localhost/user/test',
      }),
    );

    await expect(readResponse(response)).resolves.toMatchObject({
      status: 500,
      body: {
        success: false,
        error: { code: 'ERROR_REPORT_NOT_CONFIGURED' },
      },
    });
  },
);

test.sequential('returns 429 when the user is rate limited', async () => {
  for (let index = 0; index < 3; index += 1) {
    const response = await POST(
      createErrorReportRequest({
        message: `Unable to save your pick right now. ${index}`,
        page: 'http://localhost/user/test',
      }),
    );

    await expect(readResponse(response)).resolves.toMatchObject({
      status: 200,
      body: { success: true },
    });
  }

  const limitedResponse = await POST(
    createErrorReportRequest({
      message: 'Unable to save your pick right now. blocked',
      page: 'http://localhost/user/test',
    }),
  );

  await expect(readResponse(limitedResponse)).resolves.toMatchObject({
    status: 429,
    body: {
      success: false,
      error: { code: 'ERROR_REPORT_RATE_LIMITED' },
    },
  });
});

test.sequential('returns 502 when Resend cannot send the report', async () => {
  mocks.send.mockResolvedValue({
    data: null,
    error: { message: 'Unable to send' },
  });

  const response = await POST(
    createErrorReportRequest({
      message: 'Unable to save your pick right now.',
      page: 'http://localhost/user/test',
    }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 502,
    body: {
      success: false,
      error: { code: 'ERROR_REPORT_SEND_FAILED' },
    },
  });
});

test.sequential('sends the report email through Resend', async () => {
  const response = await POST(
    createErrorReportRequest({
      message: 'Unable to save your pick right now.',
      page: 'http://localhost/user/test',
    }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 200,
    body: { success: true },
  });
  expect(mocks.send).toHaveBeenCalledWith({
    from: 'PGA Pick Em <errors@auth.pga-pickem.com>',
    to: 'errors@auth.pga-pickem.com',
    subject: 'PGA Pick Em client error from golfer@example.com',
    text: [
      'A client-side error occurred in PGA Pick Em.',
      '',
      'Reporter: golfer@example.com',
      'User ID: user-1',
      'Email: golfer@example.com',
      '',
      'Page: http://localhost/user/test',
      'Error: Unable to save your pick right now.',
    ].join('\n'),
  });
});
