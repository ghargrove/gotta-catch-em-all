type TextFieldProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

/** Presents a text input field */
export const TextField: React.FC<TextFieldProps> = (props) => {
  const { className, type = "text", ...rest } = props;

  return (
    <div className="bg-white p-2 rounded-md">
      <input
        className={`bg-white text-slate-700 outline-none ${className}`}
        type={type}
        {...rest}
      />
    </div>
  );
};

/** Presents a password input field */
export const PasswordField: React.FC<Omit<TextFieldProps, "type">> = (
  props
) => {
  return <TextField type="password" {...props} />;
};
