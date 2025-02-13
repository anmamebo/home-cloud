import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { File } from "@/types";
import { EllipsisVerticalIcon, FileIcon } from "lucide-react";

type FileItemProps = {
  file: File;
};

export const FileItem = ({ file }: FileItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className="p-4 cursor-pointer hover:bg-muted/40 transition-colors"
            role="button"
            tabIndex={0}
          >
            <CardContent className="flex items-center gap-4 p-0">
              <div className="flex-none">
                <FileIcon size={22} />
              </div>
              <div className="flex-grow truncate text-md font-medium select-none">
                {file.filename}
              </div>
              <div className="flex-none">
                <EllipsisVerticalIcon size={18} />
              </div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent side="bottom">{file.filename}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
