import { useService } from "@/lib/providers/service-provider";
import { getUserStore } from "@/store/user.store";
import { useCallback } from "react";
import { Result } from "@/lib/shared/result";
import { User } from "@/api/user/domain/user.entity";
import { ServiceError } from "@/lib/errors/service-error";

export const useUser = () => {
  const { queries } = useService("user");
  const store = getUserStore();
  const state = store();

  const getUser = useCallback(
    async (id: string) => {
      store.getState().setLoading(true);
      const result = await queries.getUser(id);

      if (result.isOk()) {
        const user = result.unwrap();
        if (user) {
          store.getState().setCurrentUser(user);
        }
      }

      store.getState().setLoading(false);
      return result;
    },
    [queries],
  );

  // const refreshUserData = useCallback(async (): Promise<Result<User | null, ServiceError> | null> => {
  //   const currentUser = store.getState().currentUser;
  //   if (!currentUser?.id) {
  //     console.log('refreshUserData: No current user to refresh');
  //     return null;
  //   }

  //   console.log(`refreshUserData: Fetching fresh data for user ${currentUser.id}`);
  //   store.getState().setLoading(true);

  //   const result = await queries.getUser(currentUser.id);

  //   console.log(`refreshUserData: API call completed, success: ${result.isOk()}`);

  //   if (result.isOk()) {
  //     const user = result.unwrap();
  //     if (user) {
  //       console.log('refreshUserData: Updating user store with fresh data');
  //       store.getState().setCurrentUser(user);
  //     }
  //   } else {
  //     console.error('refreshUserData failed:', result.unwrapErr());
  //   }

  //   store.getState().setLoading(false);
  //   return result;
  // }, [queries]);

  const refreshUserData = useCallback(async () => {
    console.log("refreshUserData called in useUser hook");
    const currentUser = store.getState().currentUser;

    if (!currentUser?.id) {
      console.log("No current user found to refresh");
      return null;
    }

    console.log(`Refreshing data for user ID: ${currentUser.id}`);
    store.getState().setLoading(true);

    try {
      const result = await queries.getUser(currentUser.id, true);
      console.log(`Refresh result: ${result.isOk() ? "success" : "failure"}`);

      if (result.isOk()) {
        const user = result.unwrap();
        if (user) {
          console.log("Updating user store with fresh data");
          store.getState().setCurrentUser(user);
        } else {
          console.log("Received null user data from successful query");
        }
      } else {
        console.error("Error refreshing user data:", result.unwrapErr());
      }

      return result;
    } catch (error) {
      console.error("Exception during user refresh:", error);
      return null;
    } finally {
      store.getState().setLoading(false);
    }
  }, [queries]);

  return {
    ...state,
    getUser,
    refreshUserData,
  };
};
