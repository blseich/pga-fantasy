import path from 'path';
import csv from 'csvtojson';

const rankingsPath = path.join(process.cwd(), 'data/datagolf_rankings_current.csv');

let cachedData: any = null;

type DataGolferRank = {
  player_name: string;
  primary_tour: string;
  dg_rank: string;
  dg_change: string;
  owgr_rank: string;
  owgr_change: string;
  dg_index: string;
}

export async function  getGolferRanks(bucket:string = 'all'): Promise<DataGolferRank[]> {
  if (cachedData) {
    return cachedData[bucket];
  }

  const allRecords = await csv().fromFile(rankingsPath);
  const oneToTen = allRecords.slice(0, 10);
  const elevenToTwenty = allRecords.slice(10, 20);
  const twentyOneToForty = allRecords.slice(20, 40);
  const fortyOnePlus = allRecords.slice(40);

  cachedData = {
    '1-10': oneToTen,
    '11-20': elevenToTwenty,
    '21-40': twentyOneToForty,
    '41+': fortyOnePlus,
    'all': allRecords,
  };
  return cachedData[bucket];
}