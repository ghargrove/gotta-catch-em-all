import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";

import { getSetCardsQueryOptions } from "../../queries/get-set-cards";
import { Card, Prices } from "../../queries/get-kids";

const PriceGroup: React.FC<{ kind: Card["kind"]; prices: Prices }> = (
  props
) => {
  const { kind, prices } = props;

  return (
    <div className="mt-4 bg-slate-100 rounded-md p-2">
      <div className="flex justify-between mb-2">
        <h4 className="text-slate-600">{kind}</h4>
        <div>
          <strong className="text-xl font-bold text-green-600">${prices.market}</strong>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex justify-center">
            <strong className="text-slate-600 font-semibold">low</strong>
          </div>
          <p className="text-slate-500">${prices.low}</p>
        </div>
        <div>
          <div className="flex justify-center">
            <strong className="text-slate-600 font-semibold">mid</strong>
          </div>
          <p className="text-slate-500">${prices.mid}</p>
        </div>
        <div>
          <div className="flex justify-center">
            <strong className="text-slate-600 font-semibold">high</strong>
          </div>
          <p className="text-slate-500">${prices.high}</p>
        </div>
      </div>
    </div>
  );
};

const SetPage: React.FC = () => {
  const { setId } = Route.useParams();
  const { data } = useSuspenseQuery(getSetCardsQueryOptions(setId));

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-4 gap-6">
        {data !== undefined &&
          data.cards.map((card) => {
            const { holofoil, normal, reverseHolofoil } = card.tcgplayer.prices;

            return (
              <div
                className="bg-slate-200 p-4 rounded-md flex flex-col"
                key={card.id}
              >
                <img src={card.images.small} />
                <p className="text-slate-700 text-2xl font-semibold mt-4">
                  {card.name}
                </p>
                {normal !== undefined && (
                  <PriceGroup kind="normal" prices={normal} />
                )}
                {holofoil !== undefined && (
                  <PriceGroup kind="holofoil" prices={holofoil} />
                )}
                {reverseHolofoil !== undefined && (
                  <PriceGroup
                    kind="reverse-holofoil"
                    prices={reverseHolofoil}
                  />
                )}
              </div>
            );
          })}
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export const Route = createLazyFileRoute("/sets/$setId")({
  component: SetPage,
});
