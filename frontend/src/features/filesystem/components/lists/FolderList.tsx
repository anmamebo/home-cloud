import { FolderItem } from "@/features/filesystem";
import { Folder } from "@/types";
type FolderListProps = {
  folders: Folder[];
};

export const FolderList = ({ folders }: FolderListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {folders.map((item: Folder) => (
        <FolderItem key={item.id} folder={item} />
      ))}
    </div>
  );
};
