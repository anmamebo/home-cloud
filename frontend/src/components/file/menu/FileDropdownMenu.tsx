import { DropdownMenuContentComponent } from "@/components/file";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { File } from "@/types";
import { EllipsisVerticalIcon } from "lucide-react";

type FileDropdownMenuProps = {
  file: File;
  onDownload: () => void;
  onRename: () => void;
  onDetails: () => void;
  onActivity: () => void;
  onMoveToTrash: () => void;
};

export const FileDropdownMenu = ({
  file,
  onDownload,
  onRename,
  onDetails,
  onActivity,
  onMoveToTrash,
}: FileDropdownMenuProps) => {
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
        file={file}
        onDownload={onDownload}
        onRename={onRename}
        onDetails={onDetails}
        onActivity={onActivity}
        onMoveToTrash={onMoveToTrash}
      />
    </DropdownMenu>
  );
};
