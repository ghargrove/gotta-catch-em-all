import { createLazyFileRoute } from "@tanstack/react-router";

const SetPage: React.FC = () => {
  return (
    <div>
      <p>hello world</p>
    </div>
  )
}

export const Route = createLazyFileRoute("/sets/$setId")({
  component: SetPage
})



