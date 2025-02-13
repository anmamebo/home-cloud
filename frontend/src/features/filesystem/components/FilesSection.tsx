import { FileList } from "@/components/file/list/FileList";
import { SortItems } from "@/components/shared/SortItems";
import { FILE_SORT_OPTIONS } from "@/constants/SortOptionsConstants";
import { File, SortValue } from "@/types";

type FilesSectionProps = {
  files: File[];
  selectedFileOrder: string;
  onFileSortChange: (value: string) => void;
};

export const FilesSection = ({
  files,
  selectedFileOrder,
  onFileSortChange,
}: FilesSectionProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold">Archivos</h3>
        <SortItems
          options={FILE_SORT_OPTIONS}
          defaultOption={selectedFileOrder as SortValue}
          onSortChange={onFileSortChange}
        />
      </div>
      <FileList files={files as File[]} />
    </div>
  );
};
