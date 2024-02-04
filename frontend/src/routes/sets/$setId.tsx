import { createFileRoute } from "@tanstack/react-router";

import { queryClient } from "../../query-client";
import { getSetCardsQueryOptions } from "../../queries/get-set-cards";

export const Route = createFileRoute("/sets/$setId")({
  loader: async ({ params }) => {
    // return queryClient.ensureQueryData(getSetCardsQueryOptions(params.setId))
  }
})