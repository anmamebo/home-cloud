import { Spinner } from "@/components/ui/spinner";
import { ViewMode } from "@/constants/ViewModeConstants";
import { useFolderContext } from "@/contexts/FolderContext";
import {
  FileFilters,
  FileList,
  FilesystemHeader,
  FilesystemSection,
  FilesystemTable,
  FolderFilters,
  FolderList,
  NoContent,
} from "@/features/filesystem";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const MainPage = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const folderIdNumber = folderId ? parseInt(folderId, 10) : 0;

  const { subfolders, files, isLoading, viewMode, setFolderId } =
    useFolderContext();

  useEffect(() => {
    setFolderId(folderIdNumber);
  }, [folderIdNumber]);

  const isFolders = subfolders.length !== 0;
  const isFiles = files.length !== 0;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Spinner size="medium" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FilesystemHeader />

      {viewMode === ViewMode.GRID && (
        <>
          {/* Folders */}
          {isFolders && (
            <FilesystemSection title="Carpetas" filters={<FolderFilters />}>
              <FolderList folders={subfolders} />
            </FilesystemSection>
          )}

          {/* Files */}
          {isFiles && (
            <FilesystemSection title="Archivos" filters={<FileFilters />}>
              <FileList files={files} />
            </FilesystemSection>
          )}
        </>
      )}

      {viewMode === ViewMode.TABLE && (
        <FilesystemTable folders={subfolders} files={files} />
      )}

      {/* No content */}
      {!isLoading && !isFolders && !isFiles && <NoContent />}
    </div>
  );
};
