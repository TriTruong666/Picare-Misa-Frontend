import * as ActivityService from "@/services/activityService"
import { useFetch } from "./useFetch";
import { ActivityLog } from "@/interfaces/Activity";

type Data = {
    count: number,
    page: number,
    totalPage: number,
}

export const useGetActivityLog = (page: number, limit: number) => {
    return useFetch<ActivityLog[]>(["activity-log", page, limit], async () =>
        ActivityService.getActivityLogService(page, limit)
    );
};

export const useGetActivityLogData = (page: number, limit: number) => {
    return useFetch<Data>(["activity-log-data", page, limit], async () =>
        ActivityService.getActivityLogDataService(page, limit)
    );
};