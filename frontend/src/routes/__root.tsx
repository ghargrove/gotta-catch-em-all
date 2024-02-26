import { Suspense } from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { Layout } from "~/components/Layout";
import { Navbar } from "~/components/Navbar";

export const Route = createRootRoute({
  component: () => (
    <div>
      <Navbar />

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
