import { Order, SortByFile, SortByFolder } from "@/constants/SortConstants";
import { ViewMode } from "@/constants/ViewModeConstants";
import { FolderAction, FolderState } from "@/types";

export const initialState: FolderState = {
  folderId: null,
  folderName: "",
  subfolders: [],
  files: [],
  isLoading: true,
  sortBy: {
    folders: SortByFolder.CREATED_AT,
    files: SortByFile.CREATED_AT,
    orderFolders: Order.DESC,
    orderFiles: Order.DESC,
  },
  viewMode: ViewMode.GRID,
};

export const folderReducer = (state: FolderState, action: FolderAction) => {
  const { type } = action;

  if (type === "SET_FOLDER_ID") {
    return { ...state, folderId: action.payload };
  }

  if (type === "SET_LOADING") {
    return { ...state, isLoading: action.payload };
  }

  if (type === "SET_FOLDER_CONTENT") {
    return {
      ...state,
      folderName: action.payload.folderName,
      subfolders: action.payload.subfolders,
      files: action.payload.files,
    };
  }

  if (type === "SET_SORT_BY") {
    return { ...state, sortBy: action.payload };
  }

  if (type === "SET_VIEW_MODE") {
    return {
      ...state,
      viewMode: action.payload,
    };
  }

  return state;
};
