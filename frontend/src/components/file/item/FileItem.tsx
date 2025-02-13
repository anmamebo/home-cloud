import {
  ContextMenuContentComponent,
  FileDropdownMenu,
} from "@/components/file";
import { Card, CardContent } from "@/components/ui/card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useDownloadWithProgress } from "@/hooks/useDownloadWithProgress";
import { downloadFile } from "@/services/fileService";
import { File } from "@/types";
import { FileIcon } from "lucide-react";

type FileItemProps = {
  file: File;
};

export const FileItem = ({ file }: FileItemProps) => {
  const { handleDownload } = useDownloadWithProgress(downloadFile, file);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          className="p-4 cursor-pointer hover:bg-muted/40 transition-colors"
          role="button"
          tabIndex={0}
        >
          <CardContent className="flex items-center gap-4 p-0">
            {/* Icon */}
            <div className="flex-none">
              <FileIcon size={22} />
            </div>

            {/* Name */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-grow truncate text-md font-medium select-none">
                    {file.filename}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">{file.filename}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Actions */}
            <div className="flex-none">
              <FileDropdownMenu
                file={file}
                onDownload={handleDownload}
                onRename={() => {}}
                onDetails={() => {}}
                onActivity={() => {}}
                onMoveToTrash={() => {}}
              />
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>

      {/* Context Menu Actions */}
      <ContextMenuContentComponent
        file={file}
        onDownload={handleDownload}
        onRename={() => {}}
        onDetails={() => {}}
        onActivity={() => {}}
        onMoveToTrash={() => {}}
      />
    </ContextMenu>
  );
};
