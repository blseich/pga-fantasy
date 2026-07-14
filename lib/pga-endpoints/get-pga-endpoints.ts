import { Field, Leaderboard, Tournament } from './pga-data.types';

const query = `
query TournamentsWithField($ids: [ID!], $fieldId: ID!) {
  tournaments(ids: $ids) {
    ...TournamentFragment
  }
  field: field(id: $fieldId) {
    players {
      ...FieldPlayer
    }
  }
  leaderboard: leaderboardV3(id: $fieldId) {
    id
    players {
      ... on PlayerRowV3 {
        leaderboardSortOrder
        player {
          id
          firstName
          lastName
        }
        scoringData {
          teeTime
          total
          thru
          score
          position
          playerState
        }
      }
    }
  }
}

fragment FieldPlayer on PlayerField {
  id
  firstName
  lastName
}

fragment TournamentFragment on Tournament {
  beautyImage
  id
  tournamentName
  tournamentLogo
  tournamentLocation
  tournamentStatus
  displayDate
  courses {
    id
    courseName
  }
}`;

const variables = { ids: ['R2026100'], fieldId: 'R2026100' };

export class PGADataError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'PGADataError';
  }
}

type PGAResponse = {
  data?: {
    tournaments?: Tournament[];
    field?: Field;
    leaderboard?: Leaderboard;
  };
  errors?: { message?: string }[];
};

const getPGAData = async function () {
  const res = await fetch('https://orchestrator.pgatour.com/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: {
      'X-Api-Key': 'da2-gsrx5bibzbb4njvhl7t37wqyl4',
      Origin: 'https://www.pgatour.com',
      Referrer: 'https://www.pgatour.com/',
    },
  });

  if (!res.ok) {
    throw new PGADataError(
      'PGA Tour data is currently unavailable.',
      'PGA_HTTP_ERROR',
      res.status,
    );
  }

  let payload: PGAResponse;
  try {
    payload = await res.json();
  } catch {
    throw new PGADataError(
      'PGA Tour returned an unreadable response.',
      'PGA_INVALID_JSON',
      res.status,
    );
  }

  if (payload.errors?.length) {
    throw new PGADataError(
      payload.errors[0]?.message || 'PGA Tour returned a data error.',
      'PGA_GRAPHQL_ERROR',
      res.status,
    );
  }

  if (!payload.data) {
    throw new PGADataError(
      'PGA Tour response did not include data.',
      'PGA_MISSING_DATA',
      res.status,
    );
  }

  return payload.data;
};

export async function getTournament(): Promise<Tournament> {
  const { tournaments } = await getPGAData();
  const tournament = tournaments?.[0];

  if (!tournament) {
    throw new PGADataError(
      'PGA Tour response did not include tournament data.',
      'PGA_MISSING_TOURNAMENT',
    );
  }

  // tournament.tournamentStatus = 'NOT_STARTED';
  return tournament;
}

export async function getField(): Promise<Field['players']> {
  const { field } = await getPGAData();

  if (!Array.isArray(field?.players)) {
    throw new PGADataError(
      'PGA Tour response did not include field data.',
      'PGA_MISSING_FIELD',
    );
  }

  return field.players;
}

const formatTeeTime = (teeTime: number) =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: 'numeric',
    minute: 'numeric',
  }).format(teeTime);

export async function getLeaderboard(): Promise<Leaderboard['players']> {
  const { leaderboard } = await getPGAData();

  if (!Array.isArray(leaderboard?.players)) {
    throw new PGADataError(
      'PGA Tour response did not include leaderboard data.',
      'PGA_MISSING_LEADERBOARD',
    );
  }

  const moddedPlayers = leaderboard.players
    .filter((player: any) => typeof player.scoringData !== 'undefined')
    .map((player: any) => {
      return {
        ...player,
        scoringData: {
          ...player.scoringData,
          teeTime:
            player.scoringData.teeTime === null
              ? null
              : formatTeeTime(player.scoringData.teeTime),
        },
      };
    });
  return moddedPlayers;
}
