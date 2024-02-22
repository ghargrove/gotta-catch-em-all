import { queryOptions } from "@tanstack/react-query";

import { Prices } from "./get-kids";

type TcgCardImages = {
  large: string;
  small: string;
};

type TcgPlayerPrices = {
  holofoil?: Prices;
  normal?: Prices;
  reverseHolofoil?: Prices;
};

type TcgCard = {
  id: string;
  name: string;
  number: string
  images: TcgCardImages;
  rarity: string
  tcgplayer: { prices: TcgPlayerPrices };
};

type GetCardsBySetResult = {
  cards: TcgCard[];
};

// Retrieve card
const getCardsBySetId = async (id: string): Promise<GetCardsBySetResult> =>
  fetch(`http://127.0.0.1:8082/api/sets/${id}/cards`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => {
    if (r.ok) {
      return r.json();
    }
  });

export const getSetCardsQueryOptions = (setId: string) =>
  queryOptions({
    queryKey: ["sets", setId],
    queryFn: ({ queryKey }) => {
      return getCardsBySetId(queryKey[1]);
    },
  });
