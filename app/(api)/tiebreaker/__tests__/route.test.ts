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

const createTiebreakerRequest = (body: unknown) =>
  new Request('http://localhost/tiebreaker', {
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
  'returns 400 when the tiebreaker score is invalid',
  async () => {
    const response = await POST(
      createTiebreakerRequest({ tiebreaker_score: 'E' }),
    );

    await expect(readResponse(response)).resolves.toMatchObject({
      status: 400,
      body: {
        success: false,
        error: { code: 'INVALID_TIEBREAKER_REQUEST' },
      },
    });
  },
);

test.sequential('returns 409 when tiebreakers are locked', async () => {
  mocks.tournament = {
    id: 'tournament-1',
    tournamentStatus: 'IN_PROGRESS',
  };

  const response = await POST(
    createTiebreakerRequest({ tiebreaker_score: -12 }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 409,
    body: {
      success: false,
      error: { code: 'TIEBREAKER_LOCKED' },
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
    createTiebreakerRequest({ tiebreaker_score: -12 }),
  );

  await expect(readResponse(response)).resolves.toMatchObject({
    status: 502,
    body: {
      success: false,
      error: { code: 'PGA_HTTP_ERROR' },
    },
  });
});

test.sequential(
  'upserts the tiebreaker when the request is valid',
  async () => {
    const response = await POST(
      createTiebreakerRequest({ tiebreaker_score: -12 }),
    );

    await expect(readResponse(response)).resolves.toMatchObject({
      status: 200,
      body: { success: true, data: [{ id: 1 }] },
    });
    expect(mocks.upsert).toHaveBeenCalledWith(
      {
        user_id: 'user-1',
        tournament_id: 'tournament-1',
        tiebreaker_score: -12,
      },
      { onConflict: 'user_id,tournament_id' },
    );
  },
);
