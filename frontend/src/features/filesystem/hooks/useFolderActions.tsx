import { useDeleteItem } from "@/hooks/useDeleteItem";
import { useDownloadWithProgress } from "@/hooks/useDownloadWithProgress";
import { deleteFolder, downloadFolder } from "@/services/folderService";
import { Folder } from "@/types";
import { useState } from "react";

export const useFolderActions = (folder: Folder) => {
  const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState(false);

  // Download folder
  const { handleDownload } = useDownloadWithProgress(downloadFolder, folder);

  // Rename folder
  const handleRename = () => setIsChangeNameDialogOpen(true);

  // Delete folder
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openDeleteDialog,
    handleDelete,
  } = useDeleteItem(deleteFolder);

  const handleConfirmDelete = () => openDeleteDialog(folder.id, folder.name);

  return {
    isChangeNameDialogOpen,
    setIsChangeNameDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDownload,
    handleRename,
    handleConfirmDelete,
    handleDelete,
  };
};
