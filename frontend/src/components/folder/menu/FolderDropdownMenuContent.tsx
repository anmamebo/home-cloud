import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DownloadIcon,
  InfoIcon,
  PencilLineIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "lucide-react";

type FolderDropdownMenuContentProps = {
  onDownload: () => void;
  onRename: () => void;
  onDetails: () => void;
  onActivity: () => void;
  onMoveToTrash: () => void;
};

export const FolderDropdownMenuContent = ({
  onDownload,
  onRename,
  onDetails,
  onActivity,
  onMoveToTrash,
}: FolderDropdownMenuContentProps) => {
  return (
    <DropdownMenuContent align="end" className="w-80">
      <DropdownMenuGroup>
        <DropdownMenuItem
          onSelect={onDownload}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Descargar
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={onRename}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <PencilLineIcon className="mr-2 h-4 w-4" />
          Cambiar nombre
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <InfoIcon className="mr-2 h-4 w-4" />
            Información de la carpeta
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-60">
              <DropdownMenuItem
                onSelect={onDetails}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <InfoIcon className="mr-2 h-4 w-4" />
                Detalles
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={onActivity}
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <TrendingUpIcon className="mr-2 h-4 w-4" />
                Actividad
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onSelect={onMoveToTrash}
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <Trash2Icon className="mr-2 h-4 w-4" />
          Mover a la papelera
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
};
