import { DeleteConfirmationDialog } from "@/components/dialogs/DeleteConfirmationDialog";
import {
  ChangeNameFileDialog,
  ContextMenuContentComponent,
  FileDropdownMenuContent,
} from "@/components/file";
import { Card, CardContent } from "@/components/ui/card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFolderContext } from "@/contexts/FolderContext";
import { ItemDropdownMenu } from "@/features/filesystem";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { useDownloadWithProgress } from "@/hooks/useDownloadWithProgress";
import { deleteFile, downloadFile } from "@/services/fileService";
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

  const { fetchFolderContent } = useFolderContext();

  const { handleDownload } = useDownloadWithProgress(downloadFile, file);

  const handleRename = () => setIsChangeNameFileDialogOpen(true);

  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete,
    openDeleteDialog,
  } = useDeleteItem({
    onSuccess: () => fetchFolderContent(),
  });

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
                <ItemDropdownMenu>
                  <FileDropdownMenuContent
                    onDownload={handleDownload}
                    onRename={handleRename}
                    onDetails={() => {}}
                    onActivity={() => {}}
                    onMoveToTrash={() =>
                      openDeleteDialog(file.id, file.filename)
                    }
                  />
                </ItemDropdownMenu>
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
          onMoveToTrash={() => openDeleteDialog(file.id, file.filename)}
        />
      </ContextMenu>

      {/* Dialogs */}
      <ChangeNameFileDialog
        fileId={file.id}
        fileName={file.filename}
        open={isChangeNameFileDialogOpen}
        onOpenChange={setIsChangeNameFileDialogOpen}
      />

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={() => handleDelete(deleteFile, file.id)}
        itemName={file.filename}
      />
    </>
  );
};
