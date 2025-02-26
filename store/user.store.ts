// store/user.store.ts
import { create } from "zustand";
import { User } from "@/api/user/domain/user.entity";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/lib/storage/persist-storage";

interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  lastSynced: number | null;
}

interface UserActions {
  setCurrentUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  updateUserField: <K extends keyof User>(field: K, value: User[K]) => void;
  reset: () => void;
}

const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  lastSynced: null,
};

const createUserStore = () =>
  create<UserState & UserActions>()(
    persist(
      (set, get) => ({
        ...initialState,
        setCurrentUser: (user) =>
          set({
            currentUser: user,
            lastSynced: user ? Date.now() : null,
          }),
        setLoading: (isLoading) => set({ isLoading }),
        updateUserField: (field, value) => {
          const currentUser = get().currentUser;
          if (!currentUser) return;

          set({
            currentUser: {
              ...currentUser,
              [field]: value,
            },
          });
        },
        reset: () => set(initialState),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => zustandStorage),
        partialize: (state) => ({
          currentUser: state.currentUser,
          lastSynced: state.lastSynced,
        }),
      },
    ),
  );

let userStore: ReturnType<typeof createUserStore> | null = null;

export const getUserStore = () => {
  if (!userStore) {
    userStore = createUserStore();
  }
  return userStore;
};

export type UserStore = ReturnType<typeof createUserStore>;
