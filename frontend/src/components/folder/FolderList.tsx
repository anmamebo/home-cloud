import { Button } from "@/components/ui/button";
import { FolderType } from "@/types/folderType";
import { EllipsisVertical, Folder } from "lucide-react";

type FolderListProps = {
  folders: FolderType[];
  onNavigate: (folderId: number) => void;
  isMobile: boolean;
};

export const FolderList = ({
  folders,
  onNavigate,
  isMobile,
}: FolderListProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {folders.map((item: FolderType) => (
        <Button
          key={item.id}
          variant="outline"
          className="flex text-left items-center gap-4 p-6"
          onClick={isMobile ? () => onNavigate(item.id) : undefined}
          onDoubleClick={!isMobile ? () => onNavigate(item.id) : undefined}
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
  );
};
