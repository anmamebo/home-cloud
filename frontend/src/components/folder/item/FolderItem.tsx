import {
  ContextMenuContentComponent,
  FolderDropdownMenu,
} from "@/components/folder";
import { Card, CardContent } from "@/components/ui/card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDownloadWithProgress } from "@/hooks/useDownloadWithProgress";
import { useIsMobile } from "@/hooks/useMobile";
import { downloadFolder } from "@/services/folderService";
import { Folder } from "@/types";
import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FolderItemProps = {
  folder: Folder;
};

export const FolderItem = ({ folder }: FolderItemProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleNavigate = (folderId: number) => {
    navigate(`/carpeta/${folderId}`);
  };

  const { handleDownload } = useDownloadWithProgress(downloadFolder, folder);

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
