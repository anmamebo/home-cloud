import { Spinner } from "@/components/ui/spinner";
import { useFolderContext } from "@/contexts/FolderContext";
import { FilesSection, FoldersSection, NoContent } from "@/features/filesystem";
import { useIsMobile } from "@/hooks/useMobile";
import { File, Folder } from "@/types";
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
        <FoldersSection
          folders={subfolders as Folder[]}
          selectedFolderOrder={selectedFolderOrder}
          onFolderSortChange={handleFolderSortChange}
          onNavigate={handleNavigate}
          isMobile={isMobile}
        />
      )}

      {/* Files */}
      {numFiles !== 0 && (
        <FilesSection
          files={files as File[]}
          selectedFileOrder={selectedFileOrder}
          onFileSortChange={handleFileSortChange}
        />
      )}

      {/* No content */}
      {!isLoading && !numSubfolders && !numFiles && <NoContent />}
    </div>
  );
};
