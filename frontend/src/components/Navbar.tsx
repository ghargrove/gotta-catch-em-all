import { Link } from "@tanstack/react-router";
import { useState } from "react";

import pokemonLogo from "~/assets/logo.png";
import { Access } from "~/components/Access";
import { AuthenticationDialog } from "~/components/AuthenticationDialog";
import { Avatar } from "~/components/Avatar";
import { Button } from "~/components/Button";
import { useLocalStorage } from "~/hooks/useLocalStorage";

/** Presents the navbar containing navigation and authentication elements */
export const Navbar: React.FC = () => {
  const [presentAuthenticationDialog, setPresentAuthenticationDialog] =
    useState(false);

  const [_, __, removeUserId] = useLocalStorage<number>("user-id");

  const dismissAuthenticationDialog = () =>
    setPresentAuthenticationDialog(false);

  const handleSignInPress: React.MouseEventHandler = () =>
    setPresentAuthenticationDialog(true);

  const handleSignOutPress: React.MouseEventHandler = () => removeUserId();

  return (
    <header className="bg-blue-100 dark:bg-slate-800 py-6">
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
            {(kid) => (
              <div className="flex">
                <Link
                  className="hover:underline"
                  to="/kids/$kidId"
                  params={{ kidId: kid.id.toString() }}
                >
                  <div className="flex items-center">
                    <div className="mr-4 w-12 rounded-full overflow-hidden bg-gray-100">
                      <Avatar avatarId={kid.avatar_id} />
                    </div>
                    <span className="font-semibold">{kid.name}</span>
                  </div>
                </Link>
                <span className="px-4 self-center">|</span>
                <button
                  className="font-semibold hover:underline"
                  onClick={handleSignOutPress}
                >
                  Sign out
                </button>
              </div>
            )}
          </Access>
        </nav>
      </div>
    </header>
  );
};
