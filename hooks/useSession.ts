import { getAuthStore } from "@/store/auth.store";
import { useRouter } from "expo-router";

export const useAuthNavigation = () => {
  const router = useRouter();
  const store = getAuthStore();

  const checkAuthAndRedirect = () => {
    const { isAuthenticated } = store.getState();

    if (!isAuthenticated) {
      console.log("User is not authenticated. Redirecting to login...");
      router.replace("/(auth)/login");
    } else {
      console.log("User is authenticated. Redirecting to home...");
      router.replace("/(tabs)");
    }
  };

  return { checkAuthAndRedirect };
};