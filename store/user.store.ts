import { create } from "zustand";
import { User } from "@/api/user/domain/user.entity";

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
}

interface UserActions {
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
};

const createUserStore = () =>
  create<UserState & UserActions>((set) => ({
    ...initialState,
    setCurrentUser: (user) => set({ currentUser: user }),
    setLoading: (isLoading) => set({ isLoading }),
    reset: () => set(initialState),
  }));

let userStore: ReturnType<typeof createUserStore> | null = null;

export const getUserStore = () => {
  if (!userStore) {
    userStore = createUserStore();
  }
  return userStore;
};

export type UserStore = ReturnType<typeof createUserStore>;
