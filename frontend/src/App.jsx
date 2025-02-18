import { Routes, Route, Navigate } from "react-router-dom"; // Import routing components from react-router-dom
import LoginPage from "./pages/auth/login/LoginPage"; // Import LoginPage component
import SignUpPage from "./pages/auth/signup/SignUpPage"; // Import SignUpPage component
import HomePage from "./pages/home/HomePage"; // Import HomePage component
import Sidebar from "./components/common/Sidebar"; // Import Sidebar component
import RightPanel from "./components/common/RightPanel"; // Import RightPanel component
import NotificationPage from "./pages/notification/NotificationPage"; // Import NotificationPage component
import ProfilePage from "./pages/profile/ProfilePage"; // Import ProfilePage component
import { Toaster } from "react-hot-toast"; // Import Toaster component for displaying notifications
import { useQuery } from "@tanstack/react-query"; // Import useQuery hook from @tanstack/react-query
import LoadingSpinner from "./components/common/LoadingSpinner"; // Import LoadingSpinner component

function App() {
  // Query to get the authenticated user data
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null; // Setting data:authUser as null so navigation works correctly
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        console.log("Logged in user: ", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false, // Disable retry for this query
  });

  console.log("authUser: ", authUser);

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />{" "}
        {/* Display loading spinner while loading */}
      </div>
    );
  }

  return (
    <div className="flex max-w-6xl mx-auto">
      {authUser && <Sidebar />} {/* Show Sidebar if user is authenticated */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to={"/login"} />} // Navigate to HomePage if authenticated, else to LoginPage
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} // Navigate to LoginPage if not authenticated, else to HomePage
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to={"/"} />} // Navigate to SignUpPage if not authenticated, else to HomePage
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationPage /> : <Navigate to={"/login"} />} // Navigate to NotificationPage if authenticated, else to LoginPage
        />
        <Route
          path="/profile/:username"
          element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} // Navigate to ProfilePage if authenticated, else to LoginPage
        />
      </Routes>
      {authUser && <RightPanel />} {/* Show RightPanel if user is authenticated */}
      <Toaster /> {/* Display notifications */}
    </div>
  );
}

export default App; // Export the App component
