import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/useMobile";
import { Folder } from "@/types";
import { EllipsisVertical, FolderIcon } from "lucide-react";
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

  return (
    <Card
      className="p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
      onClick={isMobile ? () => handleNavigate(folder.id) : undefined}
      onDoubleClick={!isMobile ? () => handleNavigate(folder.id) : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleNavigate(folder.id);
        }
      }}
    >
      <CardContent className="flex items-center gap-4 p-0">
        <div className="flex-none">
          <FolderIcon size={22} />
        </div>
        <div className="flex-grow truncate text-md font-medium">
          {folder.name}
        </div>
        <div className="flex-none">
          <EllipsisVertical size={18} />
        </div>
      </CardContent>
    </Card>
  );
};
