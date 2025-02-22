import { useFolderContext } from "@/contexts/FolderContext";
import { useDeleteItem } from "@/hooks/useDeleteItem";
import { useDownloadWithProgress } from "@/hooks/useDownloadWithProgress";
import { copyFile, deleteFile, downloadFile } from "@/services/fileService";
import { notify } from "@/services/notifications";
import { File } from "@/types";
import { getErrorMessage } from "@/utils/errorUtils";
import { useState } from "react";

export const useFileActions = (file: File) => {
  const [isChangeNameDialogOpen, setIsChangeNameDialogOpen] = useState(false);

  const { fetchFolderContent } = useFolderContext();

  // Download file
  const { handleDownload } = useDownloadWithProgress(downloadFile, file);

  // Rename file
  const handleRename = () => setIsChangeNameDialogOpen(true);

  // Create copy of file
  const handleCreateCopy = async () => {
    try {
      await copyFile(file.id);
      notify.success("Copia creada con éxito.");
      fetchFolderContent();
    } catch (error) {
      notify.error(getErrorMessage(error));
      console.error(error);
    }
  };

  // Delete file
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openDeleteDialog,
    handleDelete,
  } = useDeleteItem(deleteFile);

  const handleConfirmDelete = () => openDeleteDialog(file.id, file.filename);

  return {
    isChangeNameDialogOpen,
    setIsChangeNameDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    handleDownload,
    handleRename,
    handleCreateCopy,
    handleConfirmDelete,
    handleDelete,
  };
};
