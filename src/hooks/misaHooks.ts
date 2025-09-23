import { MisaConfig, MisaDataCount } from "@/interfaces/Misa";
import { useFetch } from "./useFetch";
import * as MisaService from "@/services/misaService";

export const useGetMisaConfig = () => {
  return useFetch<MisaConfig>(["misa-config"], async () =>
    MisaService.getMisaConfigService()
  );
};

export const useGetMisaDataCount = () => {
  return useFetch<MisaDataCount>(["misa-data-count"], async () =>
    MisaService.getMisaDataCountService()
  );
};
