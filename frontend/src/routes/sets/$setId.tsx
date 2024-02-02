import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sets/$setId")({
  loader: async () => {}
})