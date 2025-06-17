import { getLeaderboard } from "@/lib/pga-endpoints/getTournament";

const query = `
query TournamentsWithField($ids: [ID!], $fieldId: ID!) {
  tournaments(ids: $ids) {
    ...TournamentFragment
  }
  field(id: $fieldId) {
    players {
      ...FieldPlayer
    }
  }
  leaderboardV3(id: $fieldId) {
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
  courses {
    id
    courseName
  }
}`;

// const query = `
//   query{
//     __schema {
//       types {
//         name
//       }
//     }
//   }
// `

// const query = `
// query {
//   playerRowV3: __type(name: "PlayerRowV3") {
//     name
//     fields {
//       name
//       type {
//         name
//         kind
//       }
//     }
//   }
//   leaderboardScoringDataV3: __type(name: "LeaderboardScoringDataV3") {
//     name
//     fields {
//       name
//       type {
//         name
//         kind
//       }
//     }
//   }
// }
// `

const variables = { "ids": ["R2025034"], "fieldId": "R2025034" };

export default async function PgaEndpointPage() {
    const data = await getLeaderboard();
    return <div>{JSON.stringify(data)}</div>
};