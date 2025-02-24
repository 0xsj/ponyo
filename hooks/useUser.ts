import { useService } from "@/lib/providers/service-provider";
import { getUserStore } from "@/store/user.store";
import { useCallback } from "react";

export const useUser = () => {
  const { queries } = useService("user");
  const store = getUserStore();
  const state = store();

  const getUser = useCallback(async (id: string) => {
    store.getState().setLoading(true);
    const result = await queries.getUser(id);
    store.getState().setLoading(false);
    return result;
  }, []);

  return {
    ...state,
    getUser,
  };
};
