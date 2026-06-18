import {
  getTournament,
  PGADataError,
} from '@/lib/pga-endpoints/get-pga-endpoints';
import { createClient } from '@/utils/supabase/server';

type TiebreakerRequestBody = {
  tiebreaker_score?: unknown;
};

const errorResponse = (status: number, code: string, message: string) =>
  Response.json({ success: false, error: { code, message } }, { status });

export async function POST(request: Request) {
  try {
    const { tiebreaker_score }: TiebreakerRequestBody = await request.json();

    if (
      typeof tiebreaker_score !== 'number' ||
      !Number.isFinite(tiebreaker_score)
    ) {
      return errorResponse(
        400,
        'INVALID_TIEBREAKER_REQUEST',
        'Tiebreaker score must be a number.',
      );
    }

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
        'TIEBREAKER_LOCKED',
        'Tiebreakers are locked for this tournament.',
      );
    }

    const { data, error } = await supabase
      .from('tiebreakers')
      .upsert(
        { user_id: user.id, tournament_id: tournament.id, tiebreaker_score },
        { onConflict: 'user_id,tournament_id' },
      );
    if (error) {
      console.error(error);
      return errorResponse(
        500,
        'TIEBREAKER_SAVE_FAILED',
        'Unable to save your tiebreaker right now.',
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
      'TIEBREAKER_REQUEST_FAILED',
      'Unable to save your tiebreaker right now.',
    );
  }
}
