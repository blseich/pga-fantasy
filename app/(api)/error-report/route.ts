import { Resend } from 'resend';

import { createClient } from '@/utils/supabase/server';
import {
  cleanupErrorReportRateLimitStore,
  isErrorReportRateLimited,
} from './rate-limit';

type ErrorReportBody = {
  message?: unknown;
  page?: unknown;
};

const errorResponse = (status: number, code: string, message: string) =>
  Response.json({ success: false, error: { code, message } }, { status });

const getErrorReportConfig = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ERROR_REPORT_TO;
  const from =
    process.env.ERROR_REPORT_FROM || (to ? `PGA Pick Em <${to}>` : '');

  if (!apiKey || !to || !from) {
    return null;
  }

  return { apiKey, from, to };
};

const getClientIp = (request: Request) =>
  request.headers.get('cf-connecting-ip')?.trim() ||
  request.headers.get('x-real-ip')?.trim() ||
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  'unknown';

export async function POST(request: Request) {
  try {
    const { message, page }: ErrorReportBody = await request.json();

    if (
      typeof message !== 'string' ||
      message.length === 0 ||
      typeof page !== 'string' ||
      page.length === 0
    ) {
      return errorResponse(
        400,
        'INVALID_ERROR_REPORT',
        'Error message and page are required.',
      );
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse(
        401,
        'UNAUTHENTICATED_REPORT',
        'Please sign in before sending an error report.',
      );
    }

    const now = Date.now();
    cleanupErrorReportRateLimitStore(now);

    const rateLimitKey = `${user.id}:${getClientIp(request)}`;

    if (isErrorReportRateLimited(rateLimitKey, now)) {
      return errorResponse(
        429,
        'ERROR_REPORT_RATE_LIMITED',
        'Please wait before sending another error report.',
      );
    }

    const config = getErrorReportConfig();

    if (!config) {
      return errorResponse(
        500,
        'ERROR_REPORT_NOT_CONFIGURED',
        'Automated error reporting is not configured.',
      );
    }

    const resend = new Resend(config.apiKey);
    const { error } = await resend.emails.send({
      from: config.from,
      to: config.to,
      subject: `PGA Pick Em client error${user.email ? ` from ${user.email}` : ''}`,
      text: [
        'A client-side error occurred in PGA Pick Em.',
        '',
        `Reporter: ${user.email || user.id}`,
        `User ID: ${user.id}`,
        user.email ? `Email: ${user.email}` : null,
        '',
        `Page: ${page}`,
        `Error: ${message}`,
      ].join('\n'),
    });

    if (error) {
      console.error(error);
      return errorResponse(
        502,
        'ERROR_REPORT_SEND_FAILED',
        'Unable to send the error report right now.',
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse(400, 'INVALID_JSON', 'Request body is not valid.');
    }

    console.error(error);
    return errorResponse(
      500,
      'ERROR_REPORT_FAILED',
      'Unable to send the error report right now.',
    );
  }
}
