import React from "react";

import { Kid } from "~/queries/get-kids";
import { useAuthenticatedKid } from "~/hooks/useAuthenticatedKid";

type AccessProps =
  | React.PropsWithChildren<{ guard?: false; guest: true }>
  | {
      children: React.ReactNode | ((kid: Kid) => React.ReactNode);
      guard: true;
      guest?: false;
    };

/**
 * Wrap a view in this component to conditionally render it based
 * on the users authentication state
 *
 * @example
 * <Access guest>
 *   <p>Presented to users who are not logged in </p>
 * </Access>
 *
 * @example
 * <Access guard>
 *   <p>Presented to users who are logged in</p>
 * </Access>
 */
export const Access: React.FC<AccessProps> = (props) => {
  const { children, guard, guest } = props;

  const kid = useAuthenticatedKid();

  if (kid === null && guest) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  // Loose null check is intentional here to also catch `undefined`
  if (kid != null && guard) {
    if (typeof children === "function") {
      return children(kid);
    }

    return <React.Fragment>{children}</React.Fragment>;
  }

  return null;
};
