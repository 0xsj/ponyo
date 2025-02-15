import { useEffect } from "react";
import { zustandStorage } from "@/lib/storage/persist-storage";

export function useDebugStorage() {
  useEffect(() => {
    const checkStorage = async () => {
      const stored = await zustandStorage.getItem("auth-storage");
      console.log("Stored auth data:", stored);
    };

    checkStorage();
  }, []);
}
