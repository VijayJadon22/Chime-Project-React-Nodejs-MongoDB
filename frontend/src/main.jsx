import { StrictMode } from "react"; // Import StrictMode component from React
import { createRoot } from "react-dom/client"; // Import createRoot function from react-dom/client for rendering
import "./index.css"; // Import global CSS styles
import App from "./App.jsx"; // Import the main App component
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter for routing
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Import QueryClient and QueryClientProvider from @tanstack/react-query

// Initialize a new QueryClient with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // By default, react-query will refetch data whenever the window is refocused.
      // This behavior ensures that the data is always fresh and up-to-date.
      // However, in some cases, frequent refetching might not be desirable,
      // for example, in applications where data doesn't change often or where frequent refetching
      // could lead to performance issues or unnecessary API calls.
      refetchOnWindowFocus: false, // Disable refetching on window focus to prevent automatic refetching of data whenever the window is refocused.
    },
  },
});

// Render the application to the DOM
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />{" "}
        {/* Render the main App component within the QueryClientProvider and BrowserRouter */}
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);
