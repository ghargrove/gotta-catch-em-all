import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";

import { Avatar } from "~/components/Avatar";
import { getKitByIdQueryOptions } from "~/queries/get-kid";

const KidPage: React.FC = () => {
  const { kidId } = Route.useParams();
  const { data: kid } = useSuspenseQuery(
    getKitByIdQueryOptions(parseInt(kidId, 10))
  );

  return (
    <div>
      <div className="flex">
        <Avatar avatarId={kid.avatar_id} />
        <div className="ml-12">
          <h2 className="text-3xl">{kid.name}</h2>
          <p>TODO: Collection summary</p>
        </div>
      </div>
      <div className="mt-24">
        <pre>{JSON.stringify(kid, null, 2)}</pre>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/kids/$kidId")({
  component: KidPage,
});
