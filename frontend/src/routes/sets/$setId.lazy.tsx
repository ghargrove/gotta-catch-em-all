import { useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";

import { Currency } from "~/components/Currency";
import { Rarity } from "~/components/Rarity";

import { useAuthenticatedKid } from "~/hooks/useAuthenticatedKid";
import { Card, kidsQueryOptions, Prices } from "~/queries/get-kids";
import { getSetCardsQueryOptions } from "~/queries/get-set-cards";

type PriceGroupsProps = {
  kind: Card["kind"];
  ownedBy: string[];
  prices: Prices;
};

/** Present pricing information about a card */
const PriceGroup: React.FC<PriceGroupsProps> = (props) => {
  const { kind, ownedBy, prices } = props;

  return (
    <div className="mt-4 bg-slate-100 rounded-md py-2">
      <div className="flex justify-between mb-2 px-2">
        <h4 className="text-slate-600">{kind}</h4>
        <div>
          <strong className="text-xl font-bold text-green-600">
            <Currency>{prices.market}</Currency>
          </strong>
        </div>
      </div>
      <div className="flex justify-between px-2">
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
      {ownedBy.length > 0 && (
        <div className="flex divide-slate-50 border-t-2 border-slate-200 pt-2 px-2 mt-2">
          {ownedBy.map((name) => (
            <div className="flex items-center justify-center bg-orange-400 rounded-full px-3">
              <p className="text-white font-semibold text-sm" key={name}>
                {name}
              </p>
            </div>
          ))}
        </div>
      )}
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

  const {
    data: { kids },
  } = useSuspenseQuery(kidsQueryOptions);

  const currentKid = useAuthenticatedKid();

  // Map each card/kind in this set to their owners
  // { 'card_id' => { 'holofoil': [1, 2] } }
  const ownedCards = useMemo(() => {
    const allOwnerships: Partial<
      Record<string, Partial<Record<string, string[]>>>
    > = {};

    // Loop through the cards owned by each kid
    for (const { name, cards } of kids) {
      for (const card of cards) {
        const { kind, set, tcg_id: id } = card;

        // Ignore cards that are not part of this set
        if (set.id !== setId) {
          continue;
        }

        // Append the kid id to a copied list of card kind owners
        allOwnerships[id] = {
          ...allOwnerships[id],
          [kind]: [...(allOwnerships[id]?.[kind] ?? []), name],
        };
      }
    }

    return allOwnerships;
  }, [kids, setId]);

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

            const ownership = ownedCards[card.id] ?? {};

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

                {normal !== undefined && (
                  <PriceGroup
                    kind="normal"
                    ownedBy={ownership["normal"] ?? []}
                    prices={normal}
                  />
                )}
                {holofoil !== undefined && (
                  <PriceGroup
                    kind="holofoil"
                    ownedBy={ownership["holofoil"] ?? []}
                    prices={holofoil}
                  />
                )}
                {reverseHolofoil !== undefined && (
                  <PriceGroup
                    kind="reverse-holofoil"
                    ownedBy={ownership["reverse-holofoil"] ?? []}
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
