import { useFolderContext } from "@/contexts/FolderContext";
import { notify } from "@/services/notifications";
import { getErrorMessage } from "@/utils/errorUtils";
import { useState } from "react";

type DeleteFunction<T> = (itemId: number) => Promise<T>;

export const useDeleteItem = <T,>(deleteFunction: DeleteFunction<T>) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { fetchFolderContent } = useFolderContext();

  const openDeleteDialog = (itemId: number, itemName: string) => {
    setItemToDelete({ id: itemId, name: itemName });
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteFunction(itemToDelete.id);
      notify.success(`"${itemToDelete.name}" se eliminó correctamente`);
      fetchFolderContent();
    } catch (error) {
      notify.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    itemToDelete,
    openDeleteDialog,
    handleDelete,
  };
};
