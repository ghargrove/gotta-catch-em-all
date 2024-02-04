
/** Provides a consistent layout */
export const Layout: React.FC<React.PropsWithChildren> = (props) => {
  const { children } = props

  return (<div className="container mx-auto py-8">{children}</div>)
}