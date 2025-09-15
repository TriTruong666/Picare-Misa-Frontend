import { User } from "@/interfaces/User";
import { useFetch } from "./useFetch";
import * as UserService from "@/services/userService"

export const useGetOwnerInfo = () => {
    return useFetch<User>(["me"], async () =>
        UserService.getUserInfo()
    );
  };