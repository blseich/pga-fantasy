import getGolferSelections from '../utils/get-golfer-selections';

vi.mock('@/lib/pga-endpoints/get-pga-endpoints', () => ({
  getField: vi.fn(() =>
    Promise.resolve([
      { id: '1', firstName: 'Ludvig', lastName: 'Åberg' },
      { id: '2', firstName: 'Nicolai', lastName: 'Højgaard' },
      { id: '3', firstName: 'Rasmus', lastName: 'Højgaard' },
      { id: '4', firstName: 'Thorbjørn', lastName: 'Olesen' },
    ]),
  ),
}));

vi.mock('../utils/get-golfer-rankings', () => ({
  getGolferRanks: vi.fn(() =>
    Promise.resolve([
      {
        player_name: 'Aberg, Ludvig',
        primary_tour: 'PGA Tour',
        dg_rank: '1',
        dg_change: '0',
        owgr_rank: '1',
        owgr_change: '0',
        dg_index: '0',
      },
      {
        player_name: 'Hojgaard, Nicolai',
        primary_tour: 'PGA Tour',
        dg_rank: '2',
        dg_change: '0',
        owgr_rank: '2',
        owgr_change: '0',
        dg_index: '0',
      },
      {
        player_name: 'Hojgaard, Rasmus',
        primary_tour: 'PGA Tour',
        dg_rank: '3',
        dg_change: '0',
        owgr_rank: '3',
        owgr_change: '0',
        dg_index: '0',
      },
      {
        player_name: 'Olesen, Thorbjorn',
        primary_tour: 'PGA Tour',
        dg_rank: '4',
        dg_change: '0',
        owgr_rank: '4',
        owgr_change: '0',
        dg_index: '0',
      },
    ]),
  ),
}));

test('matches DataGolf names to PGA names with accented characters', async () => {
  const selections = await getGolferSelections('all');

  expect(selections).toMatchObject([
    { id: '1', firstName: 'Ludvig', lastName: 'Åberg' },
    { id: '2', firstName: 'Nicolai', lastName: 'Højgaard' },
    { id: '3', firstName: 'Rasmus', lastName: 'Højgaard' },
    { id: '4', firstName: 'Thorbjørn', lastName: 'Olesen' },
  ]);
});
