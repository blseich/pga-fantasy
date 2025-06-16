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
}

fragment FieldPlayer on PlayerField {
  id
  firstName
  lastName
  headshot
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

const variables = { "ids": ["R2025034"], "fieldId": "R2025034" };

export default async function PgaEndpointPage() {
    const res = await fetch('https://orchestrator.pgatour.com/graphql', {
        method: 'POST',
        body: JSON.stringify({ query, variables }),
        headers: {
            'X-Api-Key': 'da2-gsrx5bibzbb4njvhl7t37wqyl4',
            'Origin': 'https://www.pgatour.com',
            'Referrer': 'https://www.pgatour.com/'
        }
    });
    const data = await res.json();
    return <div>{JSON.stringify(data)}</div>
};