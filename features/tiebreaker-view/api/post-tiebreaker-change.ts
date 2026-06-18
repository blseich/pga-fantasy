import { parseMutationResponse } from '@/utils/api/mutation-response';

type TiebreakerChangeResult = {
  success: boolean;
  message?: string;
};

function debounce(func: (...args: any[]) => any, delay: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this as typeof debounce, args);
    }, delay);
  };
}

async function postTiebreakerChange(
  tiebreaker_score: number,
  onError?: (message: string) => void,
) {
  let result: TiebreakerChangeResult;

  try {
    const res = await fetch('/tiebreaker', {
      method: 'POST',
      body: JSON.stringify({ tiebreaker_score }),
    });
    const response = await parseMutationResponse(res);
    result = response.success
      ? { success: true }
      : {
          success: false,
          message:
            response.error?.message ||
            'Unable to save your tiebreaker right now.',
        };
  } catch (error) {
    console.error(error);
    result = {
      success: false,
      message: 'Unable to reach the server. Please try again.',
    };
  }

  if (!result.success) {
    onError?.(result.message || 'Unable to save your tiebreaker right now.');
  }
}

export default debounce(postTiebreakerChange, 500);
