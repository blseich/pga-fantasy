import {
  getField,
  getLeaderboard,
  getTournament,
} from '@/lib/pga-endpoints/get-pga-endpoints';
import { type PickEntry } from '../types/pick-map';

const getGolferFromField = async (pick: PickEntry) => {
  const golfers = await getField();
  const golfer = golfers.find((golfer) => golfer.id === pick.golfer_id);
  return {
    player: golfer,
    scoringData: undefined,
  };
};

const getGolferFromLeaderboard = async (pick: PickEntry) => {
  const golfers = await getLeaderboard();
  return golfers.find((golfer) => golfer.player.id === pick.golfer_id);
};

export default async function getRosteredGolfer(pick: PickEntry) {
  const tournament = await getTournament();
  return tournament.tournamentStatus === 'NOT_STARTED'
    ? await getGolferFromField(pick)
    : await getGolferFromLeaderboard(pick);
}
