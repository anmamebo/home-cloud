import {
  ChangeNameFileDialog,
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
import { getFileIcon } from "@/utils/fileIconUtils";
import { formatFileSize } from "@/utils/formatUtils";
import { useState } from "react";

type FileItemProps = {
  file: File;
};

export const FileItem = ({ file }: FileItemProps) => {
  const [isChangeNameFileDialogOpen, setIsChangeNameFileDialogOpen] =
    useState(false);

  const { handleDownload } = useDownloadWithProgress(downloadFile, file);

  const handleRename = () => setIsChangeNameFileDialogOpen(true);

  const FileIcon = getFileIcon(file.filename);

  return (
    <>
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
                <FileIcon />
              </div>

              {/* Name */}
              <div className="flex-grow truncate select-none">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="truncate text-md font-medium">
                        {file.filename}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {file.filename}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div>
                  <span className="text-xs text-primary/60">
                    {formatFileSize(file.filesize)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex-none">
                <FileDropdownMenu
                  file={file}
                  onDownload={handleDownload}
                  onRename={handleRename}
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
          onRename={handleRename}
          onDetails={() => {}}
          onActivity={() => {}}
          onMoveToTrash={() => {}}
        />
      </ContextMenu>

      {/* Dialogs */}
      <ChangeNameFileDialog
        fileId={file.id}
        fileName={file.filename}
        open={isChangeNameFileDialogOpen}
        onOpenChange={setIsChangeNameFileDialogOpen}
      />
    </>
  );
};
