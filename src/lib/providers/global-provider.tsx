import { createContext, ReactNode, useContext, useEffect } from "react";
import { useCurrentUser } from "../hooks/use-auth-queries";
import { useAuth } from "../store/auth-store";
import { User } from "../schemas/auth-schemas";

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated, isLoading, setLoading } = useAuth();
  
  // Use the current user query to sync with backend
  const {
    data: currentUserData,
    isLoading: isCurrentUserLoading,
    refetch,
    error
  } = useCurrentUser();

  // Determine overall loading state
  const loading = isLoading || (isAuthenticated && isCurrentUserLoading);

  // Handle authentication state synchronization
  useEffect(() => {
    // If we have a token but no user data, and we're not loading, 
    // it means the token might be invalid
    if (isAuthenticated && !user && !loading && error) {
      console.log('Token appears to be invalid, user will be logged out');
    }
  }, [isAuthenticated, user, loading, error]);

  // Ensure loading state is properly managed
  useEffect(() => {
    if (!isLoading && !isCurrentUserLoading) {
      setLoading(false);
    }
  }, [isLoading, isCurrentUserLoading, setLoading]);

  const contextValue: GlobalContextType = {
    isLoggedIn: isAuthenticated && !!user,
    user,
    loading,
    refetch,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;