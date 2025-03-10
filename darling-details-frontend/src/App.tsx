import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

console.log("App component loaded");

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <h1 className="text-4xl font-bold text-center mt-8">
          Darling Details
        </h1>
      </div>
    </QueryClientProvider>
  );
}

export default App;