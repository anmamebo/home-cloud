import { getFolderContent } from "@/services/folderService";
import { notify } from "@/services/notifications";
import { FileType } from "@/types/fileType";
import { FolderType } from "@/types/folderType";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

type SortByType = {
  folders: string;
  files: string;
  orderFolders: string;
  orderFiles: string;
};

type FolderContextType = {
  currentFolderId: number;
  folderName: string;
  subfolders: FolderType[];
  files: FileType[];
  numSubfolders?: number;
  numFiles?: number;
  isLoading: boolean;
  sortBy: SortByType;
  setSortBy: (sortBy: SortByType) => void;
  fetchFolderContent: (folderId: number) => Promise<void>;
  refreshFolders: () => void;
};

const FolderContext = createContext<FolderContextType>({
  currentFolderId: 0,
  folderName: "",
  subfolders: [],
  files: [],
  isLoading: false,
  sortBy: {
    folders: "created_at",
    files: "created_at",
    orderFolders: "desc",
    orderFiles: "desc",
  },
  setSortBy: () => {},
  fetchFolderContent: async () => {},
  refreshFolders: () => {},
});

export const useFolderContext = () => useContext(FolderContext);

export const FolderProvider = ({ children }: { children: ReactNode }) => {
  const [currentFolderId, setCurrentFolderId] = useState(0);
  const [folderName, setFolderName] = useState("");
  const [subfolders, setSubfolders] = useState<FolderType[]>([]);
  const [files, setFiles] = useState<FileType[]>([]);
  const [numSubfolders, setNumSubfolders] = useState(0);
  const [numFiles, setNumFiles] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [sortBy, setSortBy] = useState<SortByType>({
    folders: "created_at",
    files: "created_at",
    orderFolders: "desc",
    orderFiles: "desc",
  });

  const fetchFolderContent = useCallback(
    async (folderId: number) => {
      setIsLoading(true);
      try {
        const response = await getFolderContent(
          folderId,
          sortBy.folders,
          sortBy.orderFolders,
          sortBy.files,
          sortBy.orderFiles
        );
        const {
          subfolders,
          files,
          name,
          num_subfolders: numSubFolders,
          num_files: numFiles,
        } = response;
        setCurrentFolderId(folderId);
        setFolderName(name);
        setSubfolders(subfolders);
        setFiles(files);
        setNumSubfolders(numSubFolders);
        setNumFiles(numFiles);
      } catch (error) {
        notify.error("Error al cargar el contenido de la carpeta");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [sortBy]
  );

  const refreshFolders = useCallback(() => {
    fetchFolderContent(currentFolderId);
  }, [currentFolderId, fetchFolderContent]);

  return (
    <FolderContext.Provider
      value={{
        currentFolderId,
        folderName,
        subfolders,
        files,
        numSubfolders,
        numFiles,
        isLoading,
        sortBy,
        setSortBy,
        fetchFolderContent,
        refreshFolders,
      }}
    >
      {children}
    </FolderContext.Provider>
  );
};
