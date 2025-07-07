import http from "@/lib/http";
import {
  FindAllChatBodyType,
  FindAllChatResType,
  StatisticBodyType,
  StatisticResType,
} from "@/schemas/statistic.schema";

export const statisticApiRequest = {
  statistic: (body: StatisticBodyType) =>
    http.post<StatisticResType>("/usage/statistic", body),
  findAllChats: (body: FindAllChatBodyType) =>
    http.post<FindAllChatResType>("/chat/message/find-all", body),
};
