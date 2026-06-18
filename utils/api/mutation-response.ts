type MutationErrorResponse = {
  success: false;
  error?: {
    code?: string;
    message?: string;
  };
};

type MutationSuccessResponse<TData = unknown> = {
  success: true;
  data?: TData;
};

export type MutationResponse<TData = unknown> =
  | MutationSuccessResponse<TData>
  | MutationErrorResponse;

export async function parseMutationResponse<TData = unknown>(
  response: Response,
): Promise<MutationResponse<TData>> {
  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    return {
      success: false,
      error: {
        code: 'INVALID_RESPONSE',
        message: 'The server returned an unreadable response.',
      },
    };
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'success' in payload &&
    typeof payload.success === 'boolean'
  ) {
    const mutationResponse = payload as MutationResponse<TData>;

    if (response.ok) {
      return mutationResponse;
    }

    return {
      success: false,
      error:
        mutationResponse.success === false
          ? mutationResponse.error
          : {
              code: 'REQUEST_FAILED',
              message: 'The request failed.',
            },
    };
  }

  return {
    success: false,
    error: {
      code: 'INVALID_RESPONSE',
      message: 'The server returned an unexpected response.',
    },
  };
}
