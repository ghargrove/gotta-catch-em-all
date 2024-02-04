import React, { useMemo } from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

import { indexQueryOptions } from "../../queries/get-kids";
import { Set, setQueryOptions } from "../../queries/get-sets";
import pik from "../../assets/pikachu.png";
import eevee from "../../assets/eevee.png";

const Index: React.FC = () => {
  const { data: setsData, isLoading: isSetsLoading } =
    useQuery(setQueryOptions);
  const { data, isLoading } = useSuspenseQuery(indexQueryOptions);

  const reversedSets = useMemo(() => {
    const copiedSets = [...(setsData?.sets ?? [])];
    copiedSets.reverse();

    return copiedSets;
  }, [setsData]);

  // Re-group the data by series

  const f = useMemo(() => {
    const m = new Map<string, Set[]>();

    for (const cardSet of reversedSets) {
      if (!m.has(cardSet.series)) {
        m.set(cardSet.series, []);
      }

      const value = m.get(cardSet.series) ?? [];
      m.set(cardSet.series, [...value, cardSet]);
    }

    return m;
  }, [reversedSets]);

  if (isLoading || isSetsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl pb-4">Collectors</h2>
      <div className="flex">
        {/* bg-zinc-200 */}

        {data.kids.map((kid) => (
          <Link
            className="flex border-2 border-slate-200 py-4 px-6 mr-6 rounded-md shadow-md"
            key={kid.name}
            to={`/kids/$kidId`}
            params={{ kidId: kid.id.toString(10) }}
          >
            {kid.name.toLowerCase() === "rory" && (
              <img src={eevee} width={100} />
            )}
            {kid.name.toLowerCase() === "colby" && (
              <img src={pik} width={100} />
            )}
            <div className="ml-6">
              <h4 className="text-xl">{kid.name}</h4>
              <p>Pokemon count: {kid.cards.length}</p>
              <p>Pokemon value: ${kid.value.market}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="text-3xl pb-4 mt-16">Sets</h2>

      {Array.from(f.entries()).map(([series, cardSets]) => (
        <div key={series}>
          <h4 className="text-xl mb-4">{series}</h4>
          <div className="grid grid-cols-5 gap-6 mb-24">
            {cardSets.map((set) => (
              <Link key={set.id} to={`/sets/$setId`} params={{ setId: set.id }}>
                <div className="flex flex-col justify-center items-center h-full w-full rounded-md bg-slate-200 p-6">
                  <img className="mb-4" src={set.images.symbol} width={30} />
                  <img className="mb-4" src={set.images.logo} width={120} />
                  <p className="text-slate-600 text-center">{set.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <div>
        <pre>{JSON.stringify(setsData, null, 2)}</pre>
      </div>
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
