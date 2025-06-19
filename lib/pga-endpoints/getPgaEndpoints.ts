import { Field, Leaderboard, Tournament } from "./pgaData.types";

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

const variables = { "ids": ["R2025034"], "fieldId": "R2025034" };

const  getPGAData = async function() {
   const res = await fetch('https://orchestrator.pgatour.com/graphql', {
        method: 'POST',
        body: JSON.stringify({ query, variables }),
        headers: {
            'X-Api-Key': 'da2-gsrx5bibzbb4njvhl7t37wqyl4',
            'Origin': 'https://www.pgatour.com',
            'Referrer': 'https://www.pgatour.com/'
        }
    });
  const { data } = await res.json();
  return data;
}

export async function getTournament(): Promise<Tournament> {
    const { tournaments: [tournament] } = await getPGAData();
    // tournament.tournamentStatus = 'NOT_STARTED';
    return tournament;
};

export async function getField(): Promise<Field["players"]> {
    const { field: { players } } = await getPGAData();
    return players;
};

const formatTeeTime = (teeTime: number) => (
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "numeric",
  }).format(teeTime)
);

export async function getLeaderboard(): Promise<Leaderboard["players"]> {
  const { leaderboard: { players } } = await getPGAData();
  const moddedPlayers = players.map((player: any) => ({
    ...player,
    scoringData: {
      ...player.scoringData,
      teeTime: player.scoringData.teeTime === null ? null : formatTeeTime(player.scoringData.teeTime)
    }
  }))
  return moddedPlayers;
}