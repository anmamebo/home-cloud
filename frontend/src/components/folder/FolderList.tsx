import { Folder } from "@/types";
import { FolderItem } from "./FolderItem";

type FolderListProps = {
  folders: Folder[];
};

export const FolderList = ({ folders }: FolderListProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {folders.map((item: Folder) => (
        <FolderItem key={item.id} folder={item} />
      ))}
    </div>
  );
};
