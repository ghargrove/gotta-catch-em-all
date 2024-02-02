import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import pokemonLogo from "../assets/logo.png";

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

      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  ),
});
