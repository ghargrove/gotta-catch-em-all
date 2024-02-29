import { useState } from "react";

import credentials from "~/auth.json";
import { Button } from "~/components/Button";
import { Dialog, DialogProps } from "~/components/Dialog";
import { PasswordField, TextField } from "~/components/Form";
import { useLocalStorage } from "~/hooks/useLocalStorage";

type AuthenticationDialogProps = Omit<DialogProps, "children">;

/** Presents an authentication ui within a dialog */
export const AuthenticationDialog: React.FC<AuthenticationDialogProps> = (
  props
) => {
  const { onClose } = props;

  const [didFail, setDidFail] = useState(false);
  const [auth, setAuth] = useState({
    name: "",
    password: "",
  });

  const [_, setUserId] = useLocalStorage<number>("user-id");

  const authenticateUser: React.MouseEventHandler = (e) => {
    e.preventDefault();

    for (const { id, name, password } of credentials) {
      // Check the list of credentials && store the authenticated id
      if (name === auth.name && password === auth.password) {
        setUserId(id);

        onClose();

        return;
      }
    }

    setDidFail(true);
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
          <h1 className="dark:text-slate-700 font-semibold text-lg">Sign in</h1>
        </div>

        {didFail && (
          <div className="bg-red-100 p-2 mb-4 rounded-md">
            <p className="text-red-700 font-semibold">Oops. Try again.</p>
          </div>
        )}

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
