import http from "@/lib/http";
import { ChatSessionResType } from "@/schemas/chat.schema";
import { BaseResType, PaginationBodyType } from "@/schemas/common.schema";

const chatApiRequest = {
  findAllChatSession: (body: PaginationBodyType) =>
    http.post<ChatSessionResType>("/chat/session/find-all", body),
  removeChatSession: (ids: string[]) =>
    http.delete<BaseResType>(`/chat/session/${ids.join(',')}`,),
};

export default chatApiRequest;
