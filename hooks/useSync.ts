import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useUser } from "./useUser";

export const useSyncUser = () => {
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = useAuth();
  const user = useUser();

  useEffect(() => {
    const syncUser = async () => {
      setIsLoading(true);

      try {
        if (auth.isAuthenticated) {
          const syncSuccess = await auth.checkAndSyncSession();
          setIsSynced(syncSuccess);
        } else {
          setIsSynced(true);
        }
      } catch (error) {
        console.error("Failed to sync user:", error);
        setIsSynced(false);
      } finally {
        setIsLoading(false);
      }
    };

    syncUser();
  }, [auth.isAuthenticated]);

  return {
    isSynced,
    isLoading,
    refreshUser: user.refreshUserData,
    user: user.currentUser,
    authUser: auth.user,
  };
};
