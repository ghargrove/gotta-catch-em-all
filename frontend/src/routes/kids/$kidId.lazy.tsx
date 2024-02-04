import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getKitByIdQueryOptions } from "../../queries/get-kid";

const KidPage: React.FC = () => {
  const { kidId } = Route.useParams();
  const { data: kid } = useSuspenseQuery(
    getKitByIdQueryOptions(parseInt(kidId, 10))
  );

  return (
    <div>
      <h2 className="text-3xl">{kid.name}</h2>
      <pre>{JSON.stringify(kid, null, 2)}</pre>
    </div>
  );
};

export const Route = createLazyFileRoute("/kids/$kidId")({
  component: KidPage,
});
