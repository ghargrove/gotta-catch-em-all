import { useEffect} from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import "./App.css";

const client = new QueryClient()

function App() {
  useEffect(() => {
    console.log("Hello world");

    fetch("http://localhost:8082/api/kids", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "GET",
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((e) => {
        console.log("THIS DIDNT WORK");
        console.log(e);
      });
  }, []);

  return (
    <QueryClientProvider client={client}>
      <h1>Hello world</h1>
    </QueryClientProvider>
  );
}

export default App;
