import { Suspense } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import pokemonLogo from "../assets/logo.png";
import { Layout } from "../components/Layout";

export const Route = createRootRoute({
  component: () => (
    <div>
      <div className="bg-blue-100 py-6">
        <div className="container mx-auto">
          <Link to="/">
            <img src={pokemonLogo} width={200} />
          </Link>
        </div>
      </div>

      <Layout>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </Layout>
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  ),
});
