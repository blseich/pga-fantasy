import { RefObject, useCallback } from 'react';

export const useExpandAll = (
  totalRanks: number,
  callback: (t: number[]) => void,
) =>
  useCallback(() => {
    const allIndexes = Array.from({ length: totalRanks }, (_, index) => index);
    callback(allIndexes);
  }, [totalRanks, callback]);

export const useCollapseAll = (callback: (t: number[]) => void) =>
  useCallback(() => {
    callback([]);
  }, [callback]);

export const useFindMe = (myRankRef: RefObject<HTMLButtonElement | null>) =>
  useCallback(() => {
    myRankRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
    myRankRef.current?.classList.add('highlighted');
    setTimeout(() => myRankRef.current?.classList.remove('highlighted'), 2000);
  }, [myRankRef]);
