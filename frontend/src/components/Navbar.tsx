import { useState } from "react";
import { Link } from "@tanstack/react-router";

import pokemonLogo from "~/assets/logo.png";
import { Access } from "~/components/Access";
import { AuthenticationDialog } from "~/components/AuthenticationDialog";
import { Button } from "~/components/Button";

/** Presents the navbar containing navigation and authentication elements */
export const Navbar: React.FC = () => {
  const [presentAuthenticationDialog, setPresentAuthenticationDialog] =
    useState(false);

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
          <Access guest>
            <Button onClick={handleSignInPress}>Sign in</Button>
          </Access>

          <Access guard>
            {(kid) => <span className="font-semibold">{kid.name}</span>}
          </Access>
        </nav>
      </div>
    </header>
  );
};
