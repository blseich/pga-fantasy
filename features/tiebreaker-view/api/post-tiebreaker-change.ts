function debounce(func: (...args: any[]) => any, delay: number) {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this as typeof debounce, args);
    }, delay);
  };
}

async function postTiebreakerChange(tiebreaker_score: number) {
  const res = await fetch('/tiebreaker', {
    method: 'POST',
    body: JSON.stringify({ tiebreaker_score }),
  });
  const { success } = await res.json();
  return success;
}

export default debounce(postTiebreakerChange, 500);
