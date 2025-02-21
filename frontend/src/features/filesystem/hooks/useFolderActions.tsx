import { useFolderContext } from "@/contexts/FolderContext";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { useDownloadWithProgress } from "@/hooks/useDownloadWithProgress";
import {
  deleteFolder as deleteFolderService,
  downloadFolder,
} from "@/services/folderService";
import { Folder } from "@/types";
import { useState } from "react";

export const useFolderActions = (folder: Folder) => {
  const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState(false);

  const { fetchFolderContent } = useFolderContext();

  // Download folder
  const { handleDownload } = useDownloadWithProgress(downloadFolder, folder);

  // Rename folder
  const handleRename = () => setIsChangeNameDialogOpen(true);

  // Delete folder
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDelete: deleteFolder,
    openDeleteDialog,
  } = useDeleteItem({
    onSuccess: () => fetchFolderContent(),
  });

  const handleConfirmDelete = () => openDeleteDialog(folder.id, folder.name);

  const handleDelete = () => deleteFolder(deleteFolderService, folder.id);

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
