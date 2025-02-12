import { FolderList } from "@/components/folder/FolderList";
import { SortItems } from "@/components/shared/SortItems";
import { FOLDER_SORT_OPTIONS } from "@/constants/SortOptionsConstants";
import { Folder, SortValue } from "@/types";

type FoldersSectionProps = {
  folders: Folder[];
  selectedFolderOrder: string;
  onFolderSortChange: (value: string) => void;
  onNavigate: (folderId: number) => void;
  isMobile: boolean;
};

export const FoldersSection = ({
  folders,
  selectedFolderOrder,
  onFolderSortChange,
  onNavigate,
  isMobile,
}: FoldersSectionProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold">Carpetas</h3>
        <SortItems
          options={FOLDER_SORT_OPTIONS}
          defaultOption={selectedFolderOrder as SortValue}
          onSortChange={onFolderSortChange}
        />
      </div>
      <FolderList
        folders={folders}
        onNavigate={onNavigate}
        isMobile={isMobile}
      />
    </div>
  );
};
