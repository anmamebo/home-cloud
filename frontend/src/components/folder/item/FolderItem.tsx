import {
  ContextMenuContentComponent,
  FolderDropdownMenu,
} from "@/components/folder";
import { Card, CardContent } from "@/components/ui/card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/useMobile";
import { downloadFolder } from "@/services/folderService";
import { notify } from "@/services/notifications";
import { Folder } from "@/types";
import { saveAs } from "file-saver";
import { FolderIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type FolderItemProps = {
  folder: Folder;
};

export const FolderItem = ({ folder }: FolderItemProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const toastId = useRef<string | number | null>(null);

  const handleNavigate = (folderId: number) => {
    navigate(`/carpeta/${folderId}`);
  };

  const handleDownload = async () => {
    try {
      setDownloadProgress(0);

      toastId.current = toast(
        <div>
          <p>Descargando {folder.name}...</p>
          <Progress value={0} className="mt-2" />
        </div>,
        {
          duration: Infinity, // Toast doesn't close automatically
        }
      );

      const { blob, filename } = await downloadFolder(
        folder.id,
        setDownloadProgress
      );

      saveAs(blob, filename || `${folder.name}.zip`);
      setDownloadProgress(null);
      toast.dismiss(toastId.current);
      notify.success("Descarga completada");
    } catch (error) {
      notify.error("No se pudo descargar la carpeta.");
      console.error(error);
      setDownloadProgress(null);
    }
  };

  useEffect(() => {
    if (downloadProgress !== null && toastId.current !== null) {
      toast(
        <div>
          <p>Descargando {folder.name}...</p>
          <Progress value={downloadProgress} className="mt-2" />
        </div>,
        {
          id: toastId.current, // Use the same toast ID to update the existing toast
          duration: Infinity,
        }
      );
    }
  }, [downloadProgress, folder.name]);

  const handleRename = () => {
    console.log("Cambiar nombre de la carpeta:", folder.id);
  };

  const handleDetails = () => {
    console.log("Ver detalles de la carpeta:", folder.id);
  };

  const handleActivity = () => {
    console.log("Ver actividad de la carpeta:", folder.id);
  };

  const handleMoveToTrash = () => {
    console.log("Mover a la papelera:", folder.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          className="p-4 cursor-pointer hover:bg-muted/40 transition-colors"
          onClick={isMobile ? () => handleNavigate(folder.id) : undefined}
          onDoubleClick={
            !isMobile ? () => handleNavigate(folder.id) : undefined
          }
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleNavigate(folder.id);
            }
          }}
        >
          <CardContent className="flex items-center gap-4 p-0">
            {/* Icon */}
            <div className="flex-none">
              <FolderIcon size={22} />
            </div>

            {/* Name */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-grow truncate text-md font-medium select-none">
                    {folder.name}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">{folder.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Actions */}
            <div className="flex-none">
              <FolderDropdownMenu
                folder={folder}
                onDownload={handleDownload}
                onRename={handleRename}
                onDetails={handleDetails}
                onActivity={handleActivity}
                onMoveToTrash={handleMoveToTrash}
              />
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>

      {/* Context Menu Actions */}
      <ContextMenuContentComponent
        folder={folder}
        onDownload={handleDownload}
        onRename={handleRename}
        onDetails={handleDetails}
        onActivity={handleActivity}
        onMoveToTrash={handleMoveToTrash}
      />
    </ContextMenu>
  );
};
