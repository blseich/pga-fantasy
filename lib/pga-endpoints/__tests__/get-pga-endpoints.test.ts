import {
  getField,
  getLeaderboard,
  getTournament,
  PGADataError,
} from '../get-pga-endpoints';

const mockPGAData = {
  tournaments: [
    {
      beautyImage: '',
      id: 'R1',
      tournamentName: 'Test Open',
      tournamentLogo: '',
      tournamentLocation: 'Test Course',
      tournamentStatus: 'NOT_STARTED',
      displayDate: 'Jun 1-4',
      courses: [],
    },
  ],
  field: {
    players: [{ id: '1', firstName: 'Test', lastName: 'Player' }],
  },
  leaderboard: {
    id: 'R1',
    players: [
      {
        leaderboardSortOrder: 1,
        player: { id: '1', firstName: 'Test', lastName: 'Player' },
        scoringData: {
          teeTime: null,
          total: 'E',
          thru: '-',
          score: '-',
          position: '1',
          playerState: 'NOT_STARTED',
        },
      },
    ],
  },
};

const mockFetchResponse = ({
  ok = true,
  status = 200,
  json = () => Promise.resolve({ data: mockPGAData }),
}: {
  ok?: boolean;
  status?: number;
  json?: () => Promise<unknown>;
}) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      status,
      json,
    } as Response),
  );
};

beforeEach(() => {
  mockFetchResponse({});
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('returns tournament data when the PGA response is valid', async () => {
  await expect(getTournament()).resolves.toMatchObject({
    id: 'R1',
    tournamentName: 'Test Open',
  });
});

test('returns field data when the PGA response is valid', async () => {
  await expect(getField()).resolves.toMatchObject([
    { id: '1', firstName: 'Test', lastName: 'Player' },
  ]);
});

test('returns leaderboard data when the PGA response is valid', async () => {
  await expect(getLeaderboard()).resolves.toMatchObject([
    {
      player: { id: '1' },
      scoringData: { total: 'E', teeTime: null },
    },
  ]);
});

test('throws a PGADataError for non-2xx responses', async () => {
  mockFetchResponse({ ok: false, status: 503 });

  await expect(getTournament()).rejects.toMatchObject({
    code: 'PGA_HTTP_ERROR',
    status: 503,
  } satisfies Partial<PGADataError>);
});

test('throws a PGADataError for invalid JSON responses', async () => {
  mockFetchResponse({
    json: () => Promise.reject(new SyntaxError('invalid json')),
  });

  await expect(getTournament()).rejects.toMatchObject({
    code: 'PGA_INVALID_JSON',
  } satisfies Partial<PGADataError>);
});

test('throws a PGADataError for GraphQL errors', async () => {
  mockFetchResponse({
    json: () =>
      Promise.resolve({ errors: [{ message: 'GraphQL request failed' }] }),
  });

  await expect(getTournament()).rejects.toMatchObject({
    code: 'PGA_GRAPHQL_ERROR',
    message: 'GraphQL request failed',
  } satisfies Partial<PGADataError>);
});

test('throws a PGADataError when expected data is missing', async () => {
  mockFetchResponse({ json: () => Promise.resolve({ data: {} }) });

  await expect(getLeaderboard()).rejects.toMatchObject({
    code: 'PGA_MISSING_LEADERBOARD',
  } satisfies Partial<PGADataError>);
});
