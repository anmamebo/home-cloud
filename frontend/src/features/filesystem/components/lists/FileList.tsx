import { FileItem } from "@/features/filesystem";
import { File } from "@/types";

type FileListProps = {
  files: File[];
};

export const FileList = ({ files }: FileListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
      {files.map((item: File) => (
        <FileItem key={item.id} file={item} />
      ))}
    </div>
  );
};
