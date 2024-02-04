import { queryOptions } from "@tanstack/react-query";

import { Kid } from "./get-kids";

type GetKidResult = {
  kid: Kid;
};

// Get id data based on their id
const fetchKidById = async (kidId: number): Promise<GetKidResult> => {
  return fetch(`http://127.0.0.1:8082/api/kids/${kidId}`, {
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

// Retrieve kids data
export const getKitByIdQueryOptions = (kidId: number) =>
  queryOptions({
    queryKey: ["kids", kidId],
    queryFn: async ({ queryKey }) => {
      const [_, kidId] = queryKey;

      return fetchKidById(
        typeof kidId === "number" ? kidId : parseInt(kidId, 10)
      ).then((data) => data.kid);
    },
  });
