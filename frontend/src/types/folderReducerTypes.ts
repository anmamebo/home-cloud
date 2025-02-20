import { File } from "./fileTypes";
import { Folder } from "./folderTypes";
import { SortingOptions } from "./sortTypes";

export interface FolderState {
  folderId: number | null;
  folderName: string;
  subfolders: Folder[];
  files: File[];
  isLoading: boolean;
  sortBy: SortingOptions;
}

export type FolderAction =
  | { type: "SET_FOLDER_ID"; payload: number | null }
  | { type: "SET_LOADING"; payload: boolean }
  | {
      type: "SET_FOLDER_CONTENT";
      payload: {
        folderId: number;
        folderName: string;
        subfolders: Folder[];
        files: File[];
      };
    }
  | { type: "SET_SORT_BY"; payload: SortingOptions };
