import http from "@/lib/http";
import {
  ChatResType,
  ChatSessionResType,
  CreateChatResType,
  CreateChatSessionBodyType,
  CreateChatSessionResType,
  ReactMessageBodyType,
  RenameChatSessionBodyType,
} from "@/schemas/chat.schema";
import { BaseResType, PaginationBodyType } from "@/schemas/common.schema";

const chatApiRequest = {
  findChats: (chatSessionId: string) =>
    http.get<ChatResType>(`/chat/message/${chatSessionId}`),
  sendMessage: (body: FormData) =>
    http.post<CreateChatResType>("/chat/message", body),
  reactMessage: (id: string, body: ReactMessageBodyType) =>
    http.put<BaseResType>(`/chat/message/react/${id}`, body),
  findAllChatSession: (body: PaginationBodyType) =>
    http.post<ChatSessionResType>("/chat/session/find-all", body),
  createChatSession: (body: CreateChatSessionBodyType) =>
    http.post<CreateChatSessionResType>("/chat/session", body),
  removeChatSession: (ids: string[]) =>
    http.delete<BaseResType>(`/chat/session/${ids.join(",")}`),
  renameChatSession: (id: string, body: RenameChatSessionBodyType) =>
    http.put(`/chat/session/rename/${id}`, body),
};

export default chatApiRequest;
