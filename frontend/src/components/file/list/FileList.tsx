import { FileItem } from "@/components/file";
import { File } from "@/types";

type FileListProps = {
  files: File[];
};

export const FileList = ({ files }: FileListProps) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {files.map((item: File) => (
        <FileItem key={item.id} file={item} />
      ))}
    </div>
  );
};
