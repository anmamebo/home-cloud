import { FolderList } from "@/components/folder/FolderList";
import { SortItems } from "@/components/shared/SortItems";
import { FOLDER_SORT_OPTIONS } from "@/constants/SortOptionsConstants";
import { useIsMobile } from "@/hooks/useMobile";
import { Folder, SortValue } from "@/types";
import { useNavigate } from "react-router-dom";

type FoldersSectionProps = {
  folders: Folder[];
  selectedFolderOrder: string;
  onFolderSortChange: (value: string) => void;
};

export const FoldersSection = ({
  folders,
  selectedFolderOrder,
  onFolderSortChange,
}: FoldersSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleNavigate = (folderId: number) => {
    navigate(`/carpeta/${folderId}`);
  };

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
        onNavigate={handleNavigate}
        isMobile={isMobile}
      />
    </div>
  );
};
