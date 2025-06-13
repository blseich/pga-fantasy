import path from 'path';
import csv from 'csvtojson';

const rankingsPath = path.join(process.cwd(), 'data/datagolf_rankings_current.csv');

let cachedData: any = null;

export async function  getGolferRanks() {
  if (cachedData) return cachedData;

  const records = await csv().fromFile(rankingsPath);

  cachedData = records;
  return records;
}