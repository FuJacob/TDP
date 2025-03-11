import AppRoutes from "./routes/AppRoutes";
import { useAuth } from "./features/tdp-lg/components/AuthContext";
import {getaccountAPI} from './api/api';
import { useEffect, useState } from "react";
function App() {
  const { auth, setAuth } = useAuth();
  const [appLoading, setAppLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setAppLoading(false);
        return; // No token means no authentication, stop execution
      }

      try {
        const response = await getaccountAPI(); // Fetch user data
        setAuth({
          isAuthenticated: true,
          user: {
            email: response.user.email,
            name: response.user.name || response.user.email, // Fallback to email if name is missing
          },
        });
      } catch (error) {
        console.error("Failed to fetch user account:", error);
        setAuth({ isAuthenticated: false, user: { email: "", name: "" } });
      } finally {
        setAppLoading(false); // Ensure loading state ends
      }
    };

    fetchUser();
  }, [setAuth]); // Ensure this runs when `setAuth` changes

  return <AppRoutes />;
}

export default App;
