const mocks = vi.hoisted(() => {
  class MockPGADataError extends Error {
    constructor(
      message: string,
      public readonly code: string,
      public readonly status?: number,
    ) {
      super(message);
      this.name = 'PGADataError';
    }
  }

  return {
    authGetUser: vi.fn(),
    createClient: vi.fn(),
    from: vi.fn(),
    getTournament: vi.fn(),
    tournament: null as any,
    tournamentError: null as unknown,
    upsert: vi.fn(),
    PGADataError: MockPGADataError,
  };
});

vi.mock('@/utils/supabase/server', () => ({
  createClient: mocks.createClient,
}));

vi.mock('@/lib/pga-endpoints/get-pga-endpoints', () => ({
  getTournament: mocks.getTournament,
  PGADataError: mocks.PGADataError,
}));

import { POST } from '../route';

const createPickRequest = (body: unknown) =>
  new Request('http://localhost/pick', {
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
  mocks.authGetUser.mockResolvedValue({
    data: { user: { id: 'user-1' } },
    error: null,
  });
  mocks.tournament = {
    id: 'tournament-1',
    tournamentStatus: 'NOT_STARTED',
  };
  mocks.tournamentError = null;
  mocks.getTournament.mockImplementation(async () => {
    if (mocks.tournamentError) {
      throw mocks.tournamentError;
    }

    return mocks.tournament;
  });
  mocks.upsert.mockResolvedValue({ data: [{ id: 1 }], error: null });
  mocks.from.mockReturnValue({ upsert: mocks.upsert });
  mocks.createClient.mockResolvedValue({
    auth: { getUser: mocks.authGetUser },
    from: mocks.from,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetAllMocks();
});

test.sequential(
  'returns 400 when the pick request body is invalid',
  async () => {
    const response = await POST(createPickRequest({ golfer_id: 'golfer-1' }));

    await expect(readResponse(response)).resolves.toMatchObject({
      status: 400,
      body: {
        success: false,
        error: { code: 'INVALID_PICK_REQUEST' },
      },
    });
  },
);

test.sequential('returns 401 when the user is not authenticated', async () => {
  mocks.authGetUser.mockResolvedValueOnce({
    data: { user: null },
    error: { message: 'No user' },
  });

  const response = await POST(
    createPickRequest({
      golfer_id: 'golfer-1',
      rank_bucket: '1-10',
      dg_rank: '1',
    }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 401,
    body: {
      success: false,
      error: { code: 'UNAUTHENTICATED' },
    },
  });
});

test.sequential('returns 409 when picks are locked', async () => {
  mocks.tournament = {
    id: 'tournament-1',
    tournamentStatus: 'IN_PROGRESS',
  };

  const response = await POST(
    createPickRequest({
      golfer_id: 'golfer-1',
      rank_bucket: '1-10',
      dg_rank: '1',
    }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 409,
    body: {
      success: false,
      error: { code: 'PICKS_LOCKED' },
    },
  });
});

test.sequential('returns 502 when tournament data is unavailable', async () => {
  mocks.tournamentError = new mocks.PGADataError(
    'Unavailable',
    'PGA_HTTP_ERROR',
    503,
  );

  const response = await POST(
    createPickRequest({
      golfer_id: 'golfer-1',
      rank_bucket: '1-10',
      dg_rank: '1',
    }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 502,
    body: {
      success: false,
      error: { code: 'PGA_HTTP_ERROR' },
    },
  });
});

test.sequential('returns 500 when the pick cannot be saved', async () => {
  mocks.upsert.mockResolvedValueOnce({
    data: null,
    error: { message: 'Database unavailable' },
  });

  const response = await POST(
    createPickRequest({
      golfer_id: 'golfer-1',
      rank_bucket: '1-10',
      dg_rank: '1',
    }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 500,
    body: {
      success: false,
      error: { code: 'PICK_SAVE_FAILED' },
    },
  });
});

test.sequential('upserts the pick when the request is valid', async () => {
  mocks.tournament = {
    id: 'tournament-1',
    tournamentStatus: 'NOT_STARTED',
  };

  const response = await POST(
    createPickRequest({
      golfer_id: 'golfer-1',
      rank_bucket: '1-10',
      dg_rank: '1',
    }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 200,
    body: { success: true, data: [{ id: 1 }] },
  });
  expect(mocks.upsert).toHaveBeenCalledWith(
    {
      user_id: 'user-1',
      golfer_id: 'golfer-1',
      rank_bucket: '1-10',
      dg_rank: '1',
      tournament_id: 'tournament-1',
    },
    { onConflict: 'user_id,rank_bucket,tournament_id' },
  );
});
