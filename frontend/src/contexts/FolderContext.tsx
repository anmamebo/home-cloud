import { ViewMode } from "@/constants/ViewModeConstants";
import { folderReducer, initialState } from "@/reducers/folderReducer";
import { getFolderContent } from "@/services/folderService";
import { notify } from "@/services/notifications";
import { File, Folder, SortingOptions } from "@/types";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from "react";

const useFolderReducer = () => {
  const [state, dispatch] = useReducer(folderReducer, initialState);

  const setFolderId = (folderId: number) => {
    dispatch({ type: "SET_FOLDER_ID", payload: folderId });
  };

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  };

  const fetchFolderContent = async () => {
    const folderId = state.folderId;

    if (folderId === null) return;

    setLoading(true);
    try {
      const response = await getFolderContent(folderId, state.sortBy);

      const { name, subfolders, files } = response;
      dispatch({
        type: "SET_FOLDER_CONTENT",
        payload: {
          folderName: name,
          subfolders,
          files,
        },
      });
    } catch (error) {
      notify.error("Error al cargar el contenido de la carpeta");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const setSortBy = (sortBy: SortingOptions) => {
    dispatch({ type: "SET_SORT_BY", payload: sortBy });
  };

  const setViewMode = (viewMode: ViewMode) => {
    if (viewMode === state.viewMode) return;

    dispatch({ type: "SET_VIEW_MODE", payload: viewMode });
  };

  return { state, setFolderId, fetchFolderContent, setSortBy, setViewMode };
};

type FolderContextType = {
  isLoading: boolean;
  folderId: number | null;
  folderName: string;
  subfolders: Folder[];
  files: File[];
  sortBy: SortingOptions;
  viewMode: ViewMode;
  setFolderId: (folderId: number) => void;
  fetchFolderContent: () => Promise<void>;
  setSortBy: (sortBy: SortingOptions) => void;
  setViewMode: (viewMode: ViewMode) => void;
};

const FolderContext = createContext<FolderContextType>({
  ...initialState,
  setFolderId: () => {},
  fetchFolderContent: async () => {},
  setSortBy: () => {},
  setViewMode: () => {},
});

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const { state, setFolderId, fetchFolderContent, setSortBy, setViewMode } =
    useFolderReducer();

  const {
    isLoading,
    folderId,
    folderName,
    subfolders,
    files,
    sortBy,
    viewMode,
  } = state;

  // Update folder content when sortBy changes
  useEffect(() => {
    if (folderId !== null) {
      fetchFolderContent();
    }
  }, [folderId, sortBy]);

  return (
    <FolderContext.Provider
      value={{
        isLoading,
        folderId,
        folderName,
        subfolders,
        files,
        sortBy,
        viewMode,
        setFolderId,
        fetchFolderContent,
        setSortBy,
        setViewMode,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderContext = () => useContext(FolderContext);
