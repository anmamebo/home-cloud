import { DropdownMenuContentComponent } from "@/components/folder";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Folder } from "@/types";
import { EllipsisVerticalIcon } from "lucide-react";

type FolderDropdownMenuProps = {
  folder: Folder;
  onDownload: () => void;
  onRename: () => void;
  onDetails: () => void;
  onActivity: () => void;
  onMoveToTrash: () => void;
};

export const FolderDropdownMenu = ({
  folder,
  onDownload,
  onRename,
  onDetails,
  onActivity,
  onMoveToTrash,
}: FolderDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <EllipsisVerticalIcon size={18} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContentComponent
        folder={folder}
        onDownload={onDownload}
        onRename={onRename}
        onDetails={onDetails}
        onActivity={onActivity}
        onMoveToTrash={onMoveToTrash}
      />
    </DropdownMenu>
  );
};
