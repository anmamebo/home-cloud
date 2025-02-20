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

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  };

  const fetchFolderContent = async (folderId: number) => {
    setLoading(true);
    try {
      const response = await getFolderContent(folderId, state.sortBy);

      const { name, subfolders, files } = response;
      dispatch({
        type: "SET_FOLDER_CONTENT",
        payload: {
          folderId,
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

  return { state, fetchFolderContent, setSortBy };
};

type FolderContextType = {
  isLoading: boolean;
  folderId: number | null;
  folderName: string;
  subfolders: Folder[];
  files: File[];
  sortBy: SortingOptions;
  fetchFolderContent: (folderId: number) => Promise<void>;
  setSortBy: (sortBy: SortingOptions) => void;
};

const FolderContext = createContext<FolderContextType>({
  ...initialState,
  fetchFolderContent: async () => {},
  setSortBy: () => {},
});

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const { state, fetchFolderContent, setSortBy } = useFolderReducer();

  const { isLoading, folderId, folderName, subfolders, files, sortBy } = state;

  // Update folder content when sortBy changes
  useEffect(() => {
    if (folderId !== null) {
      fetchFolderContent(folderId);
    }
  }, [sortBy]);

  return (
    <FolderContext.Provider
      value={{
        isLoading,
        folderId,
        folderName,
        subfolders,
        files,
        sortBy,
        fetchFolderContent,
        setSortBy,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};

export const useFolderContext = () => useContext(FolderContext);
