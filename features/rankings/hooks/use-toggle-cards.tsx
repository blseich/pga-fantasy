import { useCallback, useState } from 'react';

export const useToggleCards = () => {
  const [activeCards, setActiveCards] = useState<number[]>([]);

  const toggleCard = useCallback(
    (i: number) => {
      if (activeCards.includes(i)) {
        setActiveCards(activeCards.filter((index) => index !== i));
      } else {
        setActiveCards(activeCards.concat(i));
      }
    },
    [activeCards],
  );

  return { activeCards, setActiveCards, toggleCard };
};
