import { User } from "@/interfaces/User";
import { useFetch } from "./useFetch";
import * as UserService from "@/services/userService"

export const useGetOwnerInfo = () => {
    return useFetch<User>(["me"], async () =>
        UserService.getUserInfo(), {
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    }
    );
};