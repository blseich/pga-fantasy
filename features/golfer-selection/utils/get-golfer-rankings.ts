import path from 'path';

import csv from 'csvtojson';
import { DataGolferRank } from '../types/data-golf-ranking';

const rankingsPath = path.join(
  process.cwd(),
  'data/datagolf_rankings_current.csv',
);

let cachedData: any = null;

export async function getGolferRanks(
  bucket: string = 'all',
): Promise<DataGolferRank[]> {
  console.log(cachedData);
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
    all: allRecords,
  };
  return cachedData[bucket];
}
