import React from "react";
import { createLazyFileRoute, Link } from "@tanstack/react-router";

import { indexQueryOptions } from "../../queries/get-kids";
import { useSuspenseQuery } from "@tanstack/react-query";

import pik from "../../assets/pikachu.png";
import eevee from "../../assets/eevee.png";

export const bar = "bar";

const Index: React.FC = () => {
  const { data, isLoading } = useSuspenseQuery(indexQueryOptions);

  if (isLoading) {
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
            // to={`/kids/${kid.id}`}
            to="/"
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
    </div>
  );
};

export const Route = createLazyFileRoute("/")({
  component: Index,
});
