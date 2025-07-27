"use client";
import { helpCenterApiRequest } from "@/api-requests/help-center";
import SaveQuestionDialog from "@/app/shared/help-center/components/save-question-dialog";
import QuestionDetailDialog from "@/app/shared/help-center/components/question-detail-dialog";
import QuestionItem from "@/app/shared/help-center/components/question-item";
import { useAppContext } from "@/app/app-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleErrorApi } from "@/lib/error";
import { defaultPageMeta, PageMetaResType } from "@/schemas/common.schema";
import {
  FindAllQuestionsResType,
  QuestionResType,
} from "@/schemas/help-center.shema";
import {
  Check,
  ChevronsRight,
  Funnel,
  ListFilterPlus,
  Pen,
  Search,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function HelpPage() {
  const { user } = useAppContext();
  const [modeQuestionDialog, setModeQuestionDialog] = useState<
    "create" | "edit"
  >("create");
  const [oldQuestion, setOldQuestion] = useState<QuestionResType["data"]>();
  const [isQuestionDetailOpen, setIsQuestionDetailOpen] = useState(false);
  const [isSaveQuestionOpen, setIsSaveQuestionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shortQuestions, setShortQuestions] = useState<
    {
      id: number;
      title: string;
    }[]
  >([]);
  const [pageMetaShortQuestions, setPageMetaShortQuestions] =
    useState<PageMetaResType>(defaultPageMeta);
  const [pageNumberShortQuestions, setPageNumberShortQuestions] = useState(1);
  const [isLoadingShortQuestions, setIsLoadingShortQuestions] = useState(false);
  const containerShortQuestionsRef = useRef<HTMLDivElement | null>(null);
  const [questionIdDetail, setQuestionIdDetail] = useState<
    number | undefined
  >();

  const [questions, setQuestions] = useState<
    FindAllQuestionsResType["data"]["items"]
  >([]);
  const [pageMetaQuestions, setPageMetaQuestions] =
    useState<PageMetaResType>(defaultPageMeta);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const containerQuestionsRef = useRef<HTMLDivElement | null>(null);
  const [sortBy, setSortBy] = useState<"most recent" | "most useful">(
    "most recent"
  );
  const [filter, setFilter] = useState<"all" | "my post" | "others" | "pinned">(
    "all"
  );

  // Thêm ID question
  const handleOpenQuestionDetail = (questionId: number) => {
    setQuestionIdDetail(questionId);
    setIsQuestionDetailOpen(true);
  };

  const handleCloseQuestionDetail = () => {
    setIsQuestionDetailOpen(false);
  };

  const handleOpenCreateQuestion = () => {
    setIsSaveQuestionOpen(true);
  };

  const handleCloseCreateQuestion = () => {
    setIsSaveQuestionOpen(false);
    setModeQuestionDialog("create");
  };

  const handleOpenEditDialog = (question: QuestionResType["data"]) => {
    setOldQuestion(question);
    setModeQuestionDialog("edit");
    setIsSaveQuestionOpen(true);
  };

  const loadShortQuestions = async () => {
    setIsLoadingShortQuestions(true);
    try {
      const response = await helpCenterApiRequest.findAllQuestions({
        pageNumber: pageNumberShortQuestions,
        pageSize: 10,
        searchQuery: searchQuery,
        sortBy: "most recent",
      });
      const newShortQuestions = response.payload.data.items.map((item) => ({
        id: item.id,
        title: item.title,
      }));
      setShortQuestions((prev) =>
        pageNumberShortQuestions === 1
          ? newShortQuestions
          : [...prev, ...newShortQuestions]
      );
      const newMeta = response.payload.data.pageMeta;
      setPageMetaShortQuestions(newMeta);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setIsLoadingShortQuestions(false);
    }
  };

  useEffect(() => {
    loadShortQuestions();
  }, [pageNumberShortQuestions, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerShortQuestionsRef.current;
      if (
        !el ||
        !pageMetaShortQuestions?.hasNextPage ||
        isLoadingShortQuestions
      )
        return;

      const { scrollTop, scrollHeight, clientHeight } = el;

      if (scrollHeight - scrollTop - clientHeight < 30) {
        if (!isLoadingShortQuestions) {
          setPageNumberShortQuestions((prev) => prev + 1);
        }
      }
    };

    const el = containerShortQuestionsRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [pageMetaShortQuestions, isLoadingShortQuestions]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShortQuestions([]);
    setQuestions([]);
    setSearchQuery(e.target.value);
    setPageNumberShortQuestions(1);
    setPageMetaQuestions((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
  };

  const loadQuestions = async () => {
    setIsLoadingQuestions(true);
    try {
      const response = await helpCenterApiRequest.findAllQuestions({
        pageNumber: pageMetaQuestions?.pageNumber,
        pageSize: 10,
        searchQuery: searchQuery,
        sortBy: sortBy,
        type: filter,
      });
      const newQuestions = response.payload.data.items;
      setQuestions((prev) =>
        pageMetaQuestions.pageNumber === 1
          ? newQuestions
          : [...prev, ...newQuestions]
      );
      const newMeta = response.payload.data.pageMeta;
      setPageMetaQuestions(newMeta);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [pageMetaQuestions?.pageNumber, searchQuery, sortBy, filter]);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerQuestionsRef.current;
      if (!el || !pageMetaQuestions?.hasNextPage || isLoadingQuestions) return;

      const { scrollTop, scrollHeight, clientHeight } = el;

      if (scrollHeight - scrollTop - clientHeight < 30) {
        if (!isLoadingQuestions) {
          // setPageNumberQuestions((prev) => prev + 1);
          setPageMetaQuestions((prev) => ({
            ...prev,
            pageNumber: prev.pageNumber + 1,
          }));
        }
      }
    };

    const el = containerQuestionsRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, [pageMetaQuestions, isLoadingQuestions]);

  const handleSortByChange = (newSortBy: "most recent" | "most useful") => {
    setSortBy(newSortBy);
    setPageMetaQuestions((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
  };

  const handleFilterChange = (
    newFilter: "all" | "my post" | "others" | "pinned"
  ) => {
    setFilter(newFilter);
    setPageMetaQuestions((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
  };

  return (
    <div className="bg-gray-100 h-full overflow-y-auto flex">
      <div className="w-110 flex flex-col p-8 px-12 mr-8">
        <p className="text-3xl font-medium">Search for a question</p>
        <p className="text-gray-400 mt-2">
          Type your question or search keyword
        </p>
        <div className="mt-4 flex items-center justify-between gap-2 bg-white rounded-lg px-4 py-2 w-full">
          <input
            value={searchQuery}
            onChange={handleSearch}
            type="text"
            placeholder="Start typing..."
            className="bg-transparent outline-none text-black placeholder-gray-500"
          />
          <Search className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
        </div>
        <button className="text-orange-500 flex items-center justify-between gap-2 w-full p-2 px-4 rounded-md bg-orange-50 mt-20">
          <p className="font-semibold">Getting started</p>
          <ChevronsRight className="w-5 h-5" />
        </button>
        <div
          ref={containerShortQuestionsRef}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="mt-4 flex-1 space-y-1 text-gray-500 overflow-y-auto"
        >
          {shortQuestions.map((question) => (
            <div
              key={`shortQuestions_${question.id}`}
              className="font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => {
                handleOpenQuestionDetail(question.id);
              }}
            >
              {question.title}
            </div>
          ))}
          {isLoadingShortQuestions && (
            <div className="space-y-4 animate-pulse">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-md" />
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-md bg-orange-400 text-white space-y-2">
          <p className="font-medium text-lg">Do you still need our help?</p>
          <p>Send your request via email</p>
          <a
            href={"#"}
            className="inline-block py-3 px-8 bg-white text-black font-medium rounded-md"
          >
            Contact Us
          </a>
        </div>
      </div>
      <div
        className="flex-1 flex-col overflow-y-auto pt-8 pr-12"
        ref={containerQuestionsRef}
      >
        <div className="flex items-stretch justify-between">
          <button
            onClick={handleOpenCreateQuestion}
            className="p-1 pr-3 flex items-center gap-2 cursor-pointer text-orange-500 bg-white rounded-sm"
          >
            <div className="p-2 rounded-sm bg-orange-50">
              <Pen className="w-4 h-4" />
            </div>
            <p className="leading-none font-medium">NEW QUESTION</p>
          </button>
          <div className="flex gap-4 items-stretch">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer p-2 px-4 flex items-center gap-2 text-gray-400 bg-white rounded-sm">
                  <Funnel className="w-4 h-4" />
                  <p className="leading-none">SORT BY:</p>
                  <p className="text-orange-500 leading-none font-semibold">
                    {sortBy == "most recent" ? "Most recent" : "Most useful"}
                  </p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => handleSortByChange("most recent")}
                  >
                    Most recent
                    {sortBy == "most recent" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortByChange("most useful")}
                  >
                    Most useful
                    {sortBy == "most useful" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer p-2 px-4 flex items-center gap-2 text-gray-400 bg-white rounded-sm">
                  <ListFilterPlus className="w-4 h-4" />
                  <p className="text-orange-500 leading-none font-semibold">
                    {filter}
                  </p>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => handleFilterChange("all")}>
                    All
                    {filter == "all" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("my post")}
                  >
                    My post
                    {filter == "my post" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("pinned")}
                  >
                    Pinned
                    {filter == "pinned" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleFilterChange("others")}
                  >
                    Others
                    {filter == "others" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <nav className="flex-1 mt-6">
          {questions.map((question) => (
            <div
              key={`question_${question.id}`}
              className="cursor-pointer mb-4"
              onClick={() => {
                handleOpenQuestionDetail(question.id);
              }}
            >
              <QuestionItem
                question={question}
                isMyPost={question.authorId == user?.id}
                handleOpenEditDialog={handleOpenEditDialog}
              />
            </div>
          ))}
          {isLoadingQuestions && (
            <div className="space-y-4 animate-pulse mb-4">
              {Array.from({ length: 1 }).map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-md" />
              ))}
            </div>
          )}
        </nav>
      </div>
      <QuestionDetailDialog
        isOpen={isQuestionDetailOpen}
        onClose={handleCloseQuestionDetail}
        questionId={questionIdDetail}
      />
      <SaveQuestionDialog
        isOpen={isSaveQuestionOpen}
        onClose={handleCloseCreateQuestion}
        mode={modeQuestionDialog}
        oldQuestion={oldQuestion}
      />
    </div>
  );
}
