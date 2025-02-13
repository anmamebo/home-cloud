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
import { File } from "@/types";
import {
  DownloadIcon,
  InfoIcon,
  PencilLineIcon,
  Trash2Icon,
  TrendingUpIcon,
} from "lucide-react";

type DropdownMenuContentProps = {
  file: File;
  onDownload: () => void;
  onRename: () => void;
  onDetails: () => void;
  onActivity: () => void;
  onMoveToTrash: () => void;
};

export const DropdownMenuContentComponent = ({
  file,
  onDownload,
  onRename,
  onDetails,
  onActivity,
  onMoveToTrash,
}: DropdownMenuContentProps) => {
  return (
    <DropdownMenuContent align="end" className="w-80">
      <DropdownMenuGroup>
        <DropdownMenuItem onSelect={onDownload}>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Descargar
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onRename}>
          <PencilLineIcon className="mr-2 h-4 w-4" />
          Cambiar nombre
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <InfoIcon className="mr-2 h-4 w-4" />
            Información del archivo
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-60">
              <DropdownMenuItem onSelect={onDetails}>
                <InfoIcon className="mr-2 h-4 w-4" />
                Detalles
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={onActivity}>
                <TrendingUpIcon className="mr-2 h-4 w-4" />
                Actividad
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem onSelect={onMoveToTrash}>
          <Trash2Icon className="mr-2 h-4 w-4" />
          Mover a la papelera
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
};
