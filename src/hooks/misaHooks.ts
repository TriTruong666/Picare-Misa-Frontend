import { MisaConfig } from "@/interfaces/Misa";
import { useFetch } from "./useFetch";
import * as MisaService from "@/services/misaService"

export const useGetMisaConfig = () => {
    return useFetch<MisaConfig>(["misa-config"], async () =>
        MisaService.getMisaConfigService()
    );
};