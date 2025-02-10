import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFolderContext } from "@/contexts/FolderContext";
import { useIsMobile } from "@/hooks/useMobile";
import { FileType } from "@/types/fileType";
import { FolderType } from "@/types/folderType";
import { EllipsisVertical, File, Folder } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const MainPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { folderId } = useParams<{ folderId: string }>();
  const folderIdNumber = folderId ? parseInt(folderId, 10) : 0;

  const {
    subfolders,
    files,
    numSubfolders,
    numFiles,
    isLoading,
    fetchFolderContent,
  } = useFolderContext();

  useEffect(() => {
    fetchFolderContent(folderIdNumber);
  }, [folderIdNumber, fetchFolderContent]);

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
          <h3 className="text-md font-semibold mb-3">Carpetas</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {subfolders.map((item: FolderType) => (
              <Button
                key={item.id}
                variant="outline"
                className="flex text-left items-center gap-4 p-6"
                onClick={isMobile ? () => handleNavigate(item.id) : undefined}
                onDoubleClick={
                  !isMobile ? () => handleNavigate(item.id) : undefined
                }
              >
                <div className="flex-none">
                  <Folder size={28} />
                </div>
                <div className="flex-grow truncate text-md font-medium">
                  {item.name}
                </div>
                <div className="flex-none">
                  <EllipsisVertical size={22} />
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {numFiles !== 0 && (
        <div>
          <h3 className="text-md font-semibold mb-3">Archivos</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {files.map((item: FileType) => (
              <Button
                key={item.id}
                variant="outline"
                className="flex text-left items-center gap-4 p-6"
              >
                <div className="flex-none">
                  <File size={28} />
                </div>
                <div className="flex-grow truncate text-md font-medium">
                  {item.filename}
                </div>
                <div className="flex-none">
                  <EllipsisVertical size={22} />
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* No content */}
      {!isLoading && !numSubfolders && !numFiles && (
        <div className="flex flex-col items-center gap-2 text-center">
          {/* Imagen */}
          <div className="flex justify-center">
            <img
              src="/no-content-folder.svg"
              alt="No hay contenido"
              className="lg:w-1/3"
              style={{ aspectRatio: "1/1" }}
            />
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
