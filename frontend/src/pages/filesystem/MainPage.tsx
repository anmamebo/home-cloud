import { Button } from "@/components/ui/button";
import { getFolderContent } from "@/services/folderService";
import { notify } from "@/services/notifications";
import { FileType } from "@/types/fileType";
import { FolderType } from "@/types/folderType";
import { EllipsisVertical, File, Folder } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const MainPage = () => {
  const navigate = useNavigate();

  const { folderId } = useParams<{ folderId: string }>();
  const folderIdNumber = folderId ? parseInt(folderId, 10) : 0;

  const [subforlders, setSubforlders] = useState([]);
  const [files, setFiles] = useState([]);
  const [numSubfolders, setNumSubfolders] = useState(0);
  const [numFiles, setNumFiles] = useState(0);

  const fetchFolderContent = useCallback(async () => {
    try {
      const response = await getFolderContent(folderIdNumber);

      const { subfolders, files, num_files, num_subfolders } = response;

      setSubforlders(subfolders);
      setFiles(files);
      setNumSubfolders(num_subfolders);
      setNumFiles(num_files);
    } catch (error) {
      notify.error("Error al cargar el contenido de la carpeta");
      console.log(error);
    }
  }, [folderIdNumber]);

  useEffect(() => {
    fetchFolderContent();
  }, [fetchFolderContent]);

  const handleDoubleClick = (folderId: number) => {
    navigate(`/carpeta/${folderId}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Folders */}
      {numSubfolders !== 0 && (
        <div>
          <h3 className="text-md font-semibold mb-3">Carpetas</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
            {subforlders.map((item: FolderType) => (
              <Button
                key={item.id}
                variant="outline"
                className="flex text-left items-center gap-4 p-6"
                onDoubleClick={() => handleDoubleClick(item.id)}
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
    </div>
  );
};
