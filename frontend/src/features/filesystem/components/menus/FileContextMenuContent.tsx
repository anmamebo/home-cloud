import {
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import {
  DownloadIcon,
  FilesIcon,
  InfoIcon,
  PencilLineIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "lucide-react";

type FileContextMenuContentProps = {
  onDownload: () => void;
  onRename: () => void;
  onCreateCopy: () => void;
  onDetails: () => void;
  onActivity: () => void;
  onMoveToTrash: () => void;
};

export const FileContextMenuContent = ({
  onDownload,
  onRename,
  onCreateCopy,
  onDetails,
  onActivity,
  onMoveToTrash,
}: FileContextMenuContentProps) => {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuGroup>
        <ContextMenuItem onSelect={onDownload}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Descargar
        </ContextMenuItem>
        <ContextMenuItem onSelect={onRename}>
          <PencilLineIcon className="mr-2 h-4 w-4" />
          Cambiar nombre
        </ContextMenuItem>
        <ContextMenuItem onSelect={onCreateCopy}>
          <FilesIcon className="mr-2 h-4 w-4" />
          Hacer una copia
        </ContextMenuItem>
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <InfoIcon className="mr-2 h-4 w-4" />
            Información del archivo
          </ContextMenuSubTrigger>
          <ContextMenuPortal>
            <ContextMenuSubContent className="w-60">
              <ContextMenuItem onSelect={onDetails}>
                <InfoIcon className="mr-2 h-4 w-4" />
                Detalles
              </ContextMenuItem>
              <ContextMenuItem onSelect={onActivity}>
                <TrendingUpIcon className="mr-2 h-4 w-4" />
                Actividad
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuPortal>
        </ContextMenuSub>
      </ContextMenuGroup>

      <ContextMenuSeparator />

      <ContextMenuGroup>
        <ContextMenuItem onSelect={onMoveToTrash}>
          <Trash2Icon className="mr-2 h-4 w-4" />
          Mover a la papelera
        </ContextMenuItem>
      </ContextMenuGroup>
    </ContextMenuContent>
  );
};
