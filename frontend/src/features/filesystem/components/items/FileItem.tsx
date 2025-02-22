import { DeleteConfirmationDialog } from "@/components/dialogs/DeleteConfirmationDialog";
import { Card, CardContent } from "@/components/ui/card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ChangeNameDialog,
  ChangeNameFileForm,
  FileContextMenuContent,
  FileDropdownMenuContent,
  ItemDropdownMenu,
  useFileActions,
} from "@/features/filesystem";
import { File } from "@/types";
import { getFileIcon } from "@/utils/fileIconUtils";
import { formatFileSize } from "@/utils/formatUtils";

const STATIC_URL = `${import.meta.env.VITE_API_URL}/static/`;

type FileItemProps = {
  file: File;
};

export const FileItem = ({ file }: FileItemProps) => {
  const {
    isChangeNameDialogOpen,
    setIsChangeNameDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDownload,
    handleRename,
    handleCreateCopy,
    handleConfirmDelete,
    handleDelete,
  } = useFileActions(file);

  const FileIcon = getFileIcon(file.filename);

  const hasThumbnail = file.thumbnail_path !== null;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className="p-4 cursor-pointer hover:bg-muted/40 transition-colors"
            role="button"
            tabIndex={0}
          >
            <CardContent className="flex flex-col items-center gap-4 p-0">
              <div className="flex items-center gap-4 w-full">
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
                      onCreateCopy={handleCreateCopy}
                      onDetails={() => {}}
                      onActivity={() => {}}
                      onMoveToTrash={handleConfirmDelete}
                    />
                  </ItemDropdownMenu>
                </div>
              </div>

              {/* Preview */}
              {hasThumbnail ? (
                <div className="flex-none w-full h-48">
                  <img
                    src={`${STATIC_URL}${file.thumbnail_path}`}
                    alt={file.filename}
                    className="object-cover w-full h-full rounded-md"
                  />
                </div>
              ) : (
                <div className="flex-none w-full h-48">
                  <div className="flex items-center justify-center w-full h-full bg-primary/10 rounded-md">
                    <span className="text-primary/60 ">
                      <FileIcon />
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </ContextMenuTrigger>

        {/* Context Menu Actions */}
        <FileContextMenuContent
          onDownload={handleDownload}
          onRename={handleRename}
          onCreateCopy={handleCreateCopy}
          onDetails={() => {}}
          onActivity={() => {}}
          onMoveToTrash={handleConfirmDelete}
        />
      </ContextMenu>

      {/* Dialogs */}
      <ChangeNameDialog
        title="Cambiar nombre del archivo"
        description="Introduce el nuevo nombre del archivo."
        formComponent={
          <ChangeNameFileForm
            fileId={file.id}
            fileName={file.filename}
            onOpenChange={setIsChangeNameDialogOpen}
          />
        }
        open={isChangeNameDialogOpen}
        onOpenChange={setIsChangeNameDialogOpen}
      />

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={file.filename}
      />
    </>
  );
};
