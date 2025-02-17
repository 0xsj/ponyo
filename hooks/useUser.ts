import { UserService } from "@/lib/supabase/api/user/user.service";
import { UserAPI } from "@/lib/supabase/api/user/user.api";
import { supabase } from "@/lib/supabase/client/supabase-client";
import { useUserQuery } from "@/lib/supabase/api/user/user.queries";

const userAPI = new UserAPI(supabase);
const userService = new UserService(userAPI);

export const useUser = (id: string) => {
  return useUserQuery(id, userService);
};
