import {
  getTournament,
  PGADataError,
} from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

type PickRequestBody = {
  golfer_id?: unknown;
  rank_bucket?: unknown;
  dg_rank?: unknown;
};

const errorResponse = (status: number, code: string, message: string) =>
  Response.json({ success: false, error: { code, message } }, { status });

const isValidPickBody = (
  body: PickRequestBody,
): body is Required<PickRequestBody> & {
  golfer_id: string;
  rank_bucket: string;
  dg_rank: string;
} =>
  typeof body.golfer_id === 'string' &&
  body.golfer_id.length > 0 &&
  typeof body.rank_bucket === 'string' &&
  body.rank_bucket.length > 0 &&
  typeof body.dg_rank === 'string' &&
  body.dg_rank.length > 0;

export async function POST(request: Request) {
  try {
    const body: PickRequestBody = await request.json();

    if (!isValidPickBody(body)) {
      return errorResponse(
        400,
        'INVALID_PICK_REQUEST',
        'Golfer, bucket, and ranking are required.',
      );
    }

    const { golfer_id, rank_bucket, dg_rank } = body;
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse(401, 'UNAUTHENTICATED', 'Please sign in first.');
    }

    const tournament = await getTournament();

    if (tournament.tournamentStatus !== 'NOT_STARTED') {
      return errorResponse(
        409,
        'PICKS_LOCKED',
        'Picks are locked for this tournament.',
      );
    }

    const { data, error } = await supabase.from('picks').upsert(
      {
        user_id: user.id,
        golfer_id,
        rank_bucket,
        dg_rank,
        tournament_id: tournament.id,
      },
      { onConflict: 'user_id,rank_bucket,tournament_id' },
    );
    if (error) {
      console.error(error);
      return errorResponse(
        500,
        'PICK_SAVE_FAILED',
        'Unable to save your pick right now.',
      );
    }

    return Response.json({ success: true, data });
  } catch (error) {
    if (error instanceof PGADataError) {
      console.error(error);
      return errorResponse(
        502,
        error.code,
        'Tournament data is unavailable right now. Please try again.',
      );
    }

    if (error instanceof SyntaxError) {
      return errorResponse(400, 'INVALID_JSON', 'Request body is not valid.');
    }

    console.error(error);
    return errorResponse(
      500,
      'PICK_REQUEST_FAILED',
      'Unable to save your pick right now.',
    );
  }
}
