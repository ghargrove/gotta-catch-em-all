import { queryOptions } from "@tanstack/react-query";

export type Prices = {
  low: number;
  mid: number;
  high: number;
  market: number;
};

/** Represents the set to which a card belongs */
type Set = {
  /**
   * The id of the set.
   *
   * @example "swsh11"
   */
  id: string;
  /**
   * The name of the set
   *
   * @example "Lost Origin"
   */
  name: string;
  /**
   * Series to which the set belongs
   *
   * @example "Sword & Shield"
   */
  series: string;
};

// TODO: Camelcase responses
export type Card = {
  id: number;
  tcg_id: string;
  name: string;
  kind: "normal" | "holofoil" | "reverse-holofoil";
  prices: Prices;
  set: Set
};

export type Kid = {
  id: number;
  name: string;
  avatar_id: number;
  cards: Card[];
  value: Prices;
};

type KidsResult = {
  kids: Kid[];
};

export const fetchAllKids = async (): Promise<KidsResult> => {
  return fetch("http://127.0.0.1:8082/api/kids", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json();
    }
  });
};

export const kidsQueryOptions = queryOptions<KidsResult>({
  queryKey: ["kids"],
  queryFn: () => {
    return fetchAllKids();
  },
});
