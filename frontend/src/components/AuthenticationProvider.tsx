import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";

import { useLocalStorage } from "~/hooks/useLocalStorage";
import { indexQueryOptions, Kid } from "~/queries/get-kids";

/** Context used to provide the currently authenticated kid */
const KidContext = React.createContext<undefined | null | Kid>(undefined);

/** Provide the authentication user */
export const AuthenticationProvider: React.FC<React.PropsWithChildren> = (
  props
) => {
  const { children } = props;
  const { data } = useQuery(indexQueryOptions);
  const [kidId] = useLocalStorage<null | number>("user-id", null);

  // If a kid id has been persisted to local storage then attempt
  // to find them
  const kid = useMemo(() => {
    if (kidId === null) {
      return null;
    }

    if (data !== undefined) {
      const { kids } = data;
      for (const kid of kids) {
        if (kidId === kid.id) {
          return kid;
        }
      }
    }
  }, [data, kidId]);

  return <KidContext.Provider value={kid}>{children}</KidContext.Provider>;
};
