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
  ChangeNameFolderForm,
  FolderContextMenuContent,
  FolderDropdownMenuContent,
  ItemDropdownMenu,
  useFolderActions,
} from "@/features/filesystem";
import { useIsMobile } from "@/hooks/useMobile";
import { Folder } from "@/types";
import { FolderIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

type FolderItemProps = {
  folder: Folder;
};

export const FolderItem = ({ folder }: FolderItemProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const {
    isChangeNameDialogOpen,
    setIsChangeNameDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDownload,
    handleRename,
    handleConfirmDelete,
    handleDelete,
  } = useFolderActions(folder);

  const handleNavigate = (folderId: number) => {
    navigate(`/carpeta/${folderId}`);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card
            className="p-4 cursor-pointer hover:bg-muted/40 transition-colors"
            onClick={isMobile ? () => handleNavigate(folder.id) : undefined}
            onDoubleClick={
              !isMobile ? () => handleNavigate(folder.id) : undefined
            }
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleNavigate(folder.id);
              }
            }}
          >
            <CardContent className="flex items-center gap-4 p-0">
              {/* Icon */}
              <div className="flex-none">
                <FolderIcon size={22} />
              </div>

              {/* Name */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex-grow truncate text-md font-medium select-none">
                      {folder.name}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{folder.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Actions */}
              <div className="flex-none">
                <ItemDropdownMenu>
                  <FolderDropdownMenuContent
                    onDownload={handleDownload}
                    onRename={handleRename}
                    onDetails={() => {}}
                    onActivity={() => {}}
                    onMoveToTrash={handleConfirmDelete}
                  />
                </ItemDropdownMenu>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>

        {/* Context Menu Actions */}
        <FolderContextMenuContent
          onDownload={handleDownload}
          onRename={handleRename}
          onDetails={() => {}}
          onActivity={() => {}}
          onMoveToTrash={handleConfirmDelete}
        />
      </ContextMenu>

      {/* Dialogs */}
      <ChangeNameDialog
        title="Cambiar nombre de la carpeta"
        description="Introduce el nuevo nombre de la carpeta."
        formComponent={
          <ChangeNameFolderForm
            folderId={folder.id}
            folderName={folder.name}
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
        itemName={folder.name}
      />
    </>
  );
};
