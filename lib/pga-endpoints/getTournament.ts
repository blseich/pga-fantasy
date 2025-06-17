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
  courses {
    id
    courseName
  }
}`;

const variables = { "ids": ["R2025026"], "fieldId": "R2025026" };

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

export async function getTournament() {
    const { tournaments: [tournament] } = await getPGAData();
    return tournament;
};

export async function getField() {
    const { field: { players } } = await getPGAData();
    return players;
};

export async function getLeaderboard() {
  const { leaderboard: { players } } = await getPGAData();
  return players;
}