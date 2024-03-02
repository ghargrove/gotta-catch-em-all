import { createLazyFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { Currency } from "~/components/Currency";
import { Rarity } from "~/components/Rarity";

import { useAuthenticatedKid } from "~/hooks/useAuthenticatedKid";
import { getSetCardsQueryOptions } from "~/queries/get-set-cards";
import { Card, Prices } from "~/queries/get-kids";

type PriceGroupsProps = {
  kind: Card["kind"];
  prices: Prices
  // ownedBy
}

const PriceGroup: React.FC<PriceGroupsProps> = (
  props
) => {
  const { kind, prices } = props;

  return (
    <div className="mt-4 bg-slate-100 rounded-md p-2">
      <div className="flex justify-between mb-2">
        <h4 className="text-slate-600">{kind}</h4>
        <div>
          <strong className="text-xl font-bold text-green-600">
            <Currency>{prices.market}</Currency>
          </strong>
        </div>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="flex justify-center">
            <strong className="text-slate-600 font-semibold">low</strong>
          </div>
          <p className="text-slate-500">
            <Currency>{prices.low}</Currency>
          </p>
        </div>
        <div>
          <div className="flex justify-center">
            <strong className="text-slate-600 font-semibold">mid</strong>
          </div>
          <p className="text-slate-500">
            <Currency>{prices.mid}</Currency>
          </p>
        </div>
        <div>
          <div className="flex justify-center">
            <strong className="text-slate-600 font-semibold">high</strong>
          </div>
          <p className="text-slate-500">
            <Currency>{prices.high}</Currency>
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Displays information about a given set including all
 * of the cards it contains
 */
const SetPage: React.FC = () => {
  const { setId } = Route.useParams();
  const { data } = useSuspenseQuery(getSetCardsQueryOptions(setId));

  const kid = useAuthenticatedKid();
  const cards = kid?.cards;

  // Map the cards owned by this user
  const ownedCards = useMemo(() => {
    if (cards === undefined) {
      return {};
    }

    return cards.reduce<{ [index: string]: string[] }>((memo, card) => {
      const { kind, set, tcg_id: id } = card;

      if (set.id !== setId) {
        return memo;
      }

      return {
        ...memo,
        [id]: [...(memo[id] !== undefined ? memo[id] : []), kind],
      };
    }, {});
  }, [cards, setId]);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-4 gap-6">
        {data !== undefined &&
          data.cards.map((card) => {
            const {
              number,
              rarity,
              tcgplayer: { prices },
            } = card;
            const { holofoil, normal, reverseHolofoil } = prices;

            return (
              <div
                className="bg-slate-200 p-4 rounded-md flex flex-col"
                key={card.id}
              >
                <div className="flex justify-between pb-2">
                  <p>#{number}</p>
                  <Rarity rarity={rarity} />
                </div>
                <img src={card.images.small} />
                <p className="text-slate-700 text-2xl font-semibold mt-4">
                  {card.name}
                </p>
                
                {/* TODO: Make a better ui for identifying owned cards */}
                { Object.keys(ownedCards).includes(card.id) && <p>OWNED: {ownedCards[card.id]}</p> }
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
