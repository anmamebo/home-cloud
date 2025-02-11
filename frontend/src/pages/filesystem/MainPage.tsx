import { FileList } from "@/components/file/FileList";
import { FolderList } from "@/components/folder/FolderList";
import { SortItems } from "@/components/shared/SortItems";
import { Spinner } from "@/components/ui/spinner";
import {
  FILE_SORT_OPTIONS,
  FOLDER_SORT_OPTIONS,
} from "@/constants/SortOptionsConstants";
import { useFolderContext } from "@/contexts/FolderContext";
import { useIsMobile } from "@/hooks/useMobile";
import { FileType } from "@/types/fileType";
import { FolderType } from "@/types/folderType";
import { SortValue } from "@/types/SortTypes";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const MainPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { folderId } = useParams<{ folderId: string }>();
  const folderIdNumber = folderId ? parseInt(folderId, 10) : 0;

  const [selectedFolderOrder, setSelectedFolderOrder] =
    useState("created_at-desc");
  const [selectedFileOrder, setSelectedFileOrder] = useState("created_at-desc");

  const {
    subfolders,
    files,
    numSubfolders,
    numFiles,
    isLoading,
    sortBy,
    setSortBy,
    fetchFolderContent,
  } = useFolderContext();

  const handleFolderSortChange = (value: string) => {
    const [sortByFolders, orderFolders] = value.split("-");
    setSortBy({ ...sortBy, folders: sortByFolders, orderFolders });
    setSelectedFolderOrder(value);
  };

  const handleFileSortChange = (value: string) => {
    const [sortByFiles, orderFiles] = value.split("-");
    setSortBy({ ...sortBy, files: sortByFiles, orderFiles });
    setSelectedFileOrder(value);
  };

  useEffect(() => {
    fetchFolderContent(folderIdNumber);
  }, [folderIdNumber, fetchFolderContent, sortBy]);

  const handleNavigate = (folderId: number) => {
    navigate(`/carpeta/${folderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Spinner size="medium" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Folders */}
      {numSubfolders !== 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-semibold">Carpetas</h3>
            <SortItems
              options={FOLDER_SORT_OPTIONS}
              defaultOption={selectedFolderOrder as SortValue}
              onSortChange={handleFolderSortChange}
            />
          </div>
          <FolderList
            folders={subfolders as FolderType[]}
            onNavigate={handleNavigate}
            isMobile={isMobile}
          />
        </div>
      )}

      {/* Files */}
      {numFiles !== 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-md font-semibold">Archivos</h3>
            <SortItems
              options={FILE_SORT_OPTIONS}
              defaultOption={selectedFileOrder as SortValue}
              onSortChange={handleFileSortChange}
            />
          </div>
          <FileList files={files as FileType[]} />
        </div>
      )}

      {/* No content */}
      {!isLoading && !numSubfolders && !numFiles && (
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Imagen */}
          <div className="flex justify-center h-72 w-72 bg-sidebar-accent rounded-full">
            <img src="/no-content-folder.svg" alt="No hay contenido" />
          </div>

          {/* Texto */}
          <p className="font-medium">
            Parece que aún no has metido nada aquí... ¡Es hora de organizarte!
          </p>
        </div>
      )}
    </div>
  );
};
