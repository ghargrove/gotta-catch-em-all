import { useState } from "react";

import { Button } from "~/components/Button";
import { Dialog, DialogProps } from "~/components/Dialog";
import { PasswordField, TextField } from "~/components/Form";
import credentials from "~/auth.json";
import { useLocalStorage } from "~/hooks/useLocalStorage";

type AuthenticationDialogProps = Omit<DialogProps, "children">;

/** */
export const AuthenticationDialog: React.FC<AuthenticationDialogProps> = (
  props
) => {
  const [auth, setAuth] = useState({
    name: "",
    password: "",
  });

  const [_, setUserId] = useLocalStorage<null | number>('user-id', null)

  const authenticateUser: React.MouseEventHandler = (e) => {
    e.preventDefault();

    for (const { id, name, password } of credentials) {
      // Check the list of credentials && store the authenticated id
      if (name === auth.name && password === auth.password) {
        setUserId(id)
      }
    }
  };

  // Update the form state
  const handleInputChange: React.FormEventHandler<HTMLInputElement> = (evt) => {
    const {
      currentTarget: { name, value },
    } = evt;

    setAuth((prevAuth) => ({
      ...prevAuth,
      [name]: value,
    }));
  };

  return (
    <Dialog {...props}>
      <form>
        <div className="pb-4">
          <h1 className="font-semibold text-lg">Sign in</h1>
        </div>
        <div className="pb-4">
          <TextField
            id="name"
            name="name"
            onChange={handleInputChange}
            placeholder="Name"
            value={auth.name}
          />
        </div>

        <div className="pb-4">
          <PasswordField
            id="password"
            name="password"
            onChange={handleInputChange}
            placeholder="Password"
            value={auth.password}
          />
        </div>

        <div>
          <Button onClick={authenticateUser} type="submit">
            Sign in
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
