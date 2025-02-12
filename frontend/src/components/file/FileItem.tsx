import { File } from "@/types";
import { EllipsisVertical, FileIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type FileItemProps = {
  file: File;
};

export const FileItem = ({ file }: FileItemProps) => {
  return (
    <Card
      className="p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
      role="button"
      tabIndex={0}
    >
      <CardContent className="flex items-center gap-4 p-0">
        <div className="flex-none">
          <FileIcon size={22} />
        </div>
        <div className="flex-grow truncate text-md font-medium">
          {file.filename}
        </div>
        <div className="flex-none">
          <EllipsisVertical size={18} />
        </div>
      </CardContent>
    </Card>
  );
};
