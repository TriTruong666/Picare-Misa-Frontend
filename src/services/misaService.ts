import { BuildOrder } from "@/interfaces/Service";
import axiosClient from "@/utils/axios";

export const buildOrderService = async (data: BuildOrder) => {
  try {
    const res = await axiosClient.post("/misa/post_order_misa", data);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMisaConfigService = async () => {
  try {
    const res = await axiosClient.get("/misa/config");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const connectMisaService = async () => {
  try {
    const res = await axiosClient.post("/misa/connect");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const syncDataMisaService = async () => {
  try {
    const res = await axiosClient.post("/misa/sync_dictionary/all");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMisaDataCountService = async () => {
  try {
    const res = await axiosClient.get("/misa/data_count");
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
