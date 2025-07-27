"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AtSign,
  CalendarDays,
  Check,
  ChevronDown,
  CircleEllipsis,
  CirclePlus,
  CircleUser,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { handleErrorApi } from "@/lib/error";
import { extractMonth } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
} from "lucide-react";
import { userManagementApiRequest } from "@/api-requests/users-management";
import {
  FindAllUserBodyType,
  FindAllUserResType,
} from "@/schemas/users.schema";
import { defaultPageMeta, PageMetaResType } from "@/schemas/common.schema";
import { generateColor, getInitials, getTextColor } from "@/lib/avatar.utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AccountType } from "@/schemas/account.schema";
import UserDetail from "@/app/admin/user-management/components/user-detail";

export default function UserManagementPage() {
  const [userTypeFilter, setUserTypeFilter] = useState<
    "all" | "enterprise" | "free"
  >();
  const userTypeLabels: Record<"all" | "enterprise" | "free", string> = {
    all: "All",
    enterprise: "Pro",
    free: "Free",
  };
  const [userStatusFilter, setUserStatusFilter] = useState<
    "all" | "active" | "inactive"
  >();

  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [userDetail, setUserDetail] = useState<AccountType>();

  const handleOpenUserDetail = (user: AccountType) => {
    setUserDetail(user);
    setIsUserDetailOpen(true);
  };

  const handleCloseUserDetail = () => {
    setIsUserDetailOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState<FindAllUserResType["data"]["items"]>(
    []
  );
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [pageMeta, setPageMeta] = useState<PageMetaResType>(defaultPageMeta);
  const loadUsers = async () => {
    try {
      const body: FindAllUserBodyType = {
        searchQuery,
        pageNumber: pagination.pageIndex,
      };
      if (userStatusFilter && userStatusFilter != "all") {
        body.userStatus = userStatusFilter;
      }
      if (userTypeFilter && userTypeFilter != "all") {
        body.userType = userTypeFilter;
      }
      const result = await userManagementApiRequest.findAllUsers(body);
      setUserList(result.payload.data.items);
      setPageMeta(result.payload.data.pageMeta);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi(error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pagination, searchQuery, userStatusFilter, userTypeFilter]);

  const exportData = () => {
    try {
      const ids = userList.map((item) => item.id);
      userManagementApiRequest.exportUsers(ids);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      handleErrorApi({ error });
    }
  };
  return (
    <div className="flex flex-col items-center h-full">
      <div className="flex flex-col h-full px-12 py-8 w-full">
        <p className="text-3xl font-medium">User management</p>
        <p className="text-gray-500 mt-1">
          Manage users and their account permissions here
        </p>
        <div className="mt-8 flex items-stretch justify-between gap-2">
          <div className="flex items-stretch gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="cursor-pointer p-1.5 px-2.5 flex items-center gap-2 text-gray-400 border-2 border-gray-200 rounded-xl">
                  <CircleUser className="w-5 h-5" />
                  <p
                    className={`${
                      !userTypeFilter ? "text-gray-500" : "text-black"
                    } leading-none`}
                  >
                    {userTypeFilter
                      ? userTypeLabels[userTypeFilter]
                      : "User Type"}
                  </p>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setUserTypeFilter("all")}>
                    All
                    {!userTypeFilter || userTypeFilter == "all" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setUserTypeFilter("enterprise")}
                  >
                    Pro
                    {userTypeFilter == "enterprise" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setUserTypeFilter("free")}>
                    Free
                    {userTypeFilter == "free" ? (
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
                <button className="cursor-pointer p-1.5 px-2.5 flex items-center gap-2 text-gray-400 border-2 border-gray-200 rounded-xl">
                  <CirclePlus className="w-5 h-5" />
                  {/* <p className="text-gray-500 leading-none capitalize"> */}
                  <p
                    className={`${
                      !userStatusFilter ? "text-gray-500" : "text-black"
                    } leading-none capitalize`}
                  >
                    {userStatusFilter ?? "Status"}
                  </p>
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setUserStatusFilter("all")}>
                    All
                    {userStatusFilter == "all" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setUserStatusFilter("active")}
                  >
                    Active
                    {userStatusFilter == "active" ? (
                      <DropdownMenuShortcut>
                        <Check />
                      </DropdownMenuShortcut>
                    ) : (
                      ""
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setUserStatusFilter("inactive")}
                  >
                    Inactive
                    {userStatusFilter == "inactive" ? (
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
            <div className="flex items-center justify-between gap-2 bg-white rounded-xl border-2 border-gray-200 px-4 p-2">
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPagination({ pageIndex: 1, pageSize: 10 });
                }}
                type="text"
                placeholder="Start typing..."
                className="bg-transparent outline-none text-black placeholder-gray-500"
              />
              <Search className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
            </div>
          </div>
          <button
            onClick={exportData}
            className="cursor-pointer border-2 border-gray-200 p-2 px-4 rounded-lg"
          >
            Export
          </button>
        </div>

        <div className="mt-4 overflow-y-auto flex-1 overflow-hidden rounded-lg border">
          <Table className="rounded-t-lg overflow-hidden text-gray-500">
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="text-gray-400 p-2 pl-4">
                  Full name
                </TableHead>
                <TableHead className="text-gray-400 p-2">
                  <div className="flex items-center gap-1">
                    <AtSign className="w-5 h-5" />
                    <p className="leading-none">Email</p>
                  </div>
                </TableHead>
                <TableHead className="text-gray-400 p-2">
                  <div className="flex items-center gap-1">
                    <CircleUser className="w-5 h-5" />
                    <p className="leading-none">Type</p>
                  </div>
                </TableHead>
                <TableHead className="text-gray-400 p-2">
                  <div className="flex items-center gap-1">
                    <CirclePlus className="w-5 h-5" />
                    <p className="leading-none">Status</p>
                  </div>
                </TableHead>
                <TableHead className="text-gray-400 p-2">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="w-5 h-5" />
                    <p className="leading-none">Joined date</p>
                  </div>
                </TableHead>
                <TableHead className="text-gray-400 p-2 pr-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <CircleEllipsis className="w-5 h-5" />
                    <p className="leading-none">Actions</p>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[100px] truncate py-4 pl-4">
                    <div className="flex items-center gap-2">
                      <Avatar
                        className={`${
                          item?.avatar
                            ? ""
                            : generateColor(
                                `${item?.firstName} ${item?.lastName}`
                              )
                        } flex items-center justify-center w-10 h-10 rounded-full overflow-hidden`}
                      >
                        <AvatarImage
                          className="object-cover w-full h-full"
                          src={item?.avatar || ""}
                          alt="@shadcn"
                        />
                        <AvatarFallback
                          className={`text-lg ${getTextColor(
                            `${item?.firstName} ${item?.lastName}`
                          )}`}
                        >
                          {getInitials(`${item?.firstName} ${item?.lastName}`)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-medium">{`${item.firstName} ${item.lastName}`}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate py-4">
                    {item.email}
                  </TableCell>
                  <TableCell className="truncate py-4 capitalize">
                    <p
                      className={`${
                        item.userType === "free"
                          ? "bg-amber-100"
                          : "bg-green-100"
                      } leading-none inline-block w-fit p-1 px-2 border border-gray-300 rounded-sm`}
                    >
                      {item.userType}
                    </p>
                  </TableCell>
                  <TableCell className="truncate py-4 capitalize">
                    {/* {item.isActive} */}
                    <div className="w-fit leading-none p-1 px-2 flex items-center gap-1 border border-gray-300 rounded-sm">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          item.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                      <p>{item.isActive ? "Active" : "Inactive"}</p>
                    </div>
                  </TableCell>
                  <TableCell className="truncate py-4 pr-4">
                    {new Date(item.createdAt).getDate()}{" "}
                    {extractMonth(new Date(item.createdAt))}{" "}
                    {new Date(item.createdAt).getFullYear()}
                    {", "}
                    {new Date(item.createdAt).getHours()}
                    {":"}
                    {new Date(item.createdAt).getMinutes()}
                  </TableCell>
                  <TableCell className="py-4 pr-4">
                    <div className="flex justify-end items-center gap-2">
                      <button
                        onClick={() => {
                          handleOpenUserDetail(item);
                        }}
                        className="flex items-center gap-1 p-1 px-2 border-gray-300 border-2 hover:bg-gray-100 rounded-sm cursor-pointer"
                      >
                        <Eye className="w-5 h-5" strokeWidth={2} />
                        <p className="leading-none">Details</p>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-end items-center gap-2">
          <p className="mr-6">
            Page {pagination.pageIndex} of {pageMeta.totalPages}
          </p>
          <button
            disabled={pagination.pageIndex === 1}
            onClick={() => setPagination({ pageIndex: 0, pageSize: 10 })}
            className={`p-2 border border-gray-300 rounded-sm ${
              pagination.pageIndex === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <ChevronsLeft className="w-5 h-5" />
          </button>
          <button
            disabled={pagination.pageIndex === 1}
            onClick={() =>
              setPagination({
                pageIndex: Math.max(1, pagination.pageIndex - 1),
                pageSize: 10,
              })
            }
            className={`p-2 border border-gray-300 rounded-sm ${
              pagination.pageIndex === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            disabled={pagination.pageIndex === pageMeta.totalPages}
            onClick={() =>
              setPagination({
                pageIndex: Math.min(
                  pageMeta.totalPages,
                  pagination.pageIndex + 1
                ),
                pageSize: 10,
              })
            }
            className={`p-2 border border-gray-300 rounded-sm ${
              pagination.pageIndex === pageMeta.totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            disabled={pagination.pageIndex === pageMeta.totalPages}
            onClick={() =>
              setPagination({ pageIndex: pageMeta.totalPages, pageSize: 10 })
            }
            className={`p-2 border border-gray-300 rounded-sm ${
              pagination.pageIndex === pageMeta.totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-50 cursor-pointer"
            }`}
          >
            <ChevronsRight className="w-5 h-5" />
          </button>
        </div>
        <UserDetail
          isOpen={isUserDetailOpen}
          onClose={handleCloseUserDetail}
          user={userDetail}
        />
      </div>
    </div>
  );
}
