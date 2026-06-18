import { getField } from '@/lib/pga-endpoints/get-pga-endpoints';
import { getGolferRanks } from './get-golfer-rankings';

const specialLatinLetters: Record<string, string> = {
  Ð: 'D',
  đ: 'd',
  Đ: 'D',
  ð: 'd',
  ł: 'l',
  Ł: 'L',
  ø: 'o',
  Ø: 'O',
  þ: 'th',
  Þ: 'Th',
};

export const normalizeGolferName = (name: string) =>
  name
    .replace(/[ÐđĐðłŁøØþÞ]/g, (letter) => specialLatinLetters[letter])
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const golferNameIncludes = (pgaName: string, dataGolfName: string) =>
  normalizeGolferName(pgaName).includes(normalizeGolferName(dataGolfName));

export default async function getGolferSelections(bucket: string) {
  const golferRankings = await getGolferRanks(bucket);
  const golfers = await getField();
  return golferRankings.map((rankedGolfer) => {
    const [last, first] = rankedGolfer.player_name.split(', ');
    const foundGolfer = golfers.find(
      (g) =>
        golferNameIncludes(g.lastName, last) &&
        golferNameIncludes(g.firstName, first),
    );
    return foundGolfer
      ? {
          ...foundGolfer,
          rank: {
            dg_rank: rankedGolfer.dg_rank,
            owgr_rank: rankedGolfer.owgr_rank,
          },
        }
      : rankedGolfer;
  });
}
