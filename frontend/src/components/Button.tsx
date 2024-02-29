type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

/** Presents a button elment */
export const Button: React.FC<ButtonProps> = (props) => {
  const { className, ...rest } = props;

  return (
    <button
      className={`bg-green-600 font-semibold rounded-md px-4 py-2 text-white ${className}`}
      {...rest}
    />
  );
};
