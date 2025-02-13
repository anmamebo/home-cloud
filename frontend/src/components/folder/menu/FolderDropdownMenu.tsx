import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folder } from "@/types";
import { EllipsisVertical } from "lucide-react";
import { DropdownMenuContentComponent } from "./DropdownMenuContentComponent";

type FolderDropdownMenuProps = {
  folder: Folder;
};

export const FolderDropdownMenu = ({ folder }: FolderDropdownMenuProps) => {
  const handleDownload = () => {
    console.log("Descargar carpeta:", folder.id);
  };

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation(); // Detiene la propagación del evento
            e.preventDefault(); // Evita el comportamiento predeterminado
          }}
        >
          <EllipsisVertical size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContentComponent
        folder={folder}
        onDownload={handleDownload}
        onRename={handleRename}
        onDetails={handleDetails}
        onActivity={handleActivity}
        onMoveToTrash={handleMoveToTrash}
      />
    </DropdownMenu>
  );
};
