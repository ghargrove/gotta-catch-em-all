import { useState } from "react";
import { Link } from "@tanstack/react-router";

import pokemonLogo from "~/assets/logo.png";
import { AuthenticationDialog } from "~/components/AuthenticationDialog";
import { Button } from "~/components/Button";
import { useAuthenticatedKid } from "~/hooks/useAuthenticatedKid";

/** Presents the navbar containing navigation and authentication elements */
export const Navbar: React.FC = () => {
  const [presentAuthenticationDialog, setPresentAuthenticationDialog] =
    useState(false);
  const currentKid = useAuthenticatedKid();

  const dismissAuthenticationDialog = () =>
    setPresentAuthenticationDialog(false);

  const handleSignInPress: React.MouseEventHandler = () =>
    setPresentAuthenticationDialog(true);

  return (
    <header className="bg-blue-100 py-6">
      {presentAuthenticationDialog && (
        <AuthenticationDialog onClose={dismissAuthenticationDialog} />
      )}
      <div className="container flex mx-auto justify-between">
        <Link to="/">
          <img src={pokemonLogo} width={200} />
        </Link>

        <nav className="flex items-center">
          {currentKid === null && (
            <Button onClick={handleSignInPress}>Sign in</Button>
          )}

          {
            currentKid !== undefined && currentKid !== null && (
              <span className="font-semibold">{currentKid.name}</span>
            )
          }
        </nav>
      </div>
    </header>
  );
};
