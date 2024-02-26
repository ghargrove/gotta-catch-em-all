import { useState } from "react";

import { Button } from "~/components/Button";
import { Dialog, DialogProps } from "~/components/Dialog";
import { PasswordField, TextField } from "~/components/Form";

type AuthenticationDialogProps = Omit<DialogProps, "children">;

/** */
export const AuthenticationDialog: React.FC<AuthenticationDialogProps> = (
  props
) => {
  const [auth, setAuth] = useState({
    name: "",
    password: "",
  });

  const authenticateUser: React.MouseEventHandler = () => {
    console.log(auth);
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
        <Button onClick={authenticateUser}>Sign in</Button>
      </div>
    </Dialog>
  );
};
