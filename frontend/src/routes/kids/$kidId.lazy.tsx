import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getKitByIdQueryOptions } from "../../queries/get-kid";
import eevee from "../../assets/eevee.png";
import pikachu from "../../assets/pikachu.png";

type AvatarProps = React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
> & {
  avatarId: number;
};

const Avatar: React.FC<AvatarProps> = (props) => {
  const { avatarId, ...rest } = props;

  switch (avatarId) {
    case 1:
      return <img src={eevee} {...rest} />;
    case 2:
      return <img src={pikachu} {...rest} />;
  }
};

const KidPage: React.FC = () => {
  const { kidId } = Route.useParams();
  const { data: kid } = useSuspenseQuery(
    getKitByIdQueryOptions(parseInt(kidId, 10))
  );

  return (
    <div>
      <div className="flex">
        <Avatar avatarId={kid.avatar_id} width={100} />
        <div className="ml-12">
          <h2 className="text-3xl">{kid.name}</h2>
          <p>TODO: Collection summary</p>
        </div>
      </div>
      <pre>{JSON.stringify(kid, null, 2)}</pre>
    </div>
  );
};

export const Route = createLazyFileRoute("/kids/$kidId")({
  component: KidPage,
});
