import { createFileRoute } from "@tanstack/react-router";

import { queryClient } from "../../query-client";
import { kidsQueryOptions } from "../../queries/get-kids";

export const Route = createFileRoute("/")({
  loader: () => queryClient.ensureQueryData(kidsQueryOptions),
});
