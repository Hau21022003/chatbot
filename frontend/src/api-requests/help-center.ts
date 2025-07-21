import http from "@/lib/http";
import {
  CommentResType,
  CreateCommentResType,
  CreateQuestionBodyType,
  CreateQuestionResType,
  FindAllQuestionsBodyType,
  FindAllQuestionsResType,
  QuestionResType,
  ReactCommentBodyType,
  UpdateQuestionBodyType,
  UploadImageResType,
} from "@/schemas/help-center.shema";
import { number } from "zod";

export const helpCenterApiRequest = {
  createQuestion: (body: CreateQuestionBodyType) =>
    http.post<CreateQuestionResType>("/question", body),
  updateQuestion: (questionId: number, body: UpdateQuestionBodyType) =>
    http.put(`/question/${questionId}`, body),
  findAllQuestions: (body: FindAllQuestionsBodyType) =>
    http.post<FindAllQuestionsResType>("/question/find-all", body),
  uploadImage: (body: FormData) =>
    http.post<UploadImageResType>("/question/upload-image", body),
  findOneQuestion: (questionId: number) =>
    http.get<QuestionResType>(`/question/${questionId}`),
  reactComment: (commentId: number, body: ReactCommentBodyType) =>
    http.post<CommentResType>(`/comment/react-comment/${commentId}`, body),
  createComment: (body: FormData) =>
    http.post<CreateCommentResType>("/comment", body),
};
