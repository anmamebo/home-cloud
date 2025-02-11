import { Button } from "@/components/ui/button";
import { FileType } from "@/types/fileType";
import { EllipsisVertical, File } from "lucide-react";

type FileListProps = {
  files: FileType[];
};

export const FileList = ({ files }: FileListProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {files.map((item: FileType) => (
        <Button
          key={item.id}
          variant="outline"
          className="flex text-left items-center gap-4 p-6"
        >
          <div className="flex-none">
            <File size={28} />
          </div>
          <div className="flex-grow truncate text-md font-medium">
            {item.filename}
          </div>
          <div className="flex-none">
            <EllipsisVertical size={22} />
          </div>
        </Button>
      ))}
    </div>
  );
};
