import { notify } from "@/services/notifications";
import { getErrorMessage } from "@/utils/errorUtils";
import { useState } from "react";

type DeleteFunction<T> = (itemId: number) => Promise<T>;

interface UseDeleteItemProps {
  onSuccess?: () => void;
}

export const useDeleteItem = <T,>({ onSuccess }: UseDeleteItemProps = {}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const handleDelete = async (
    deleteFunction: DeleteFunction<T>,
    itemId: number
  ) => {
    if (!itemToDelete) return;

    try {
      await deleteFunction(itemId);
      notify.success(`"${itemToDelete.name}" se eliminó correctamente`);
      onSuccess?.();
    } catch (error) {
      notify.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  const openDeleteDialog = (itemId: number, itemName: string) => {
    setItemToDelete({ id: itemId, name: itemName });
    setIsDeleteDialogOpen(true);
  };

  return {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    itemToDelete,
    handleDelete,
    openDeleteDialog,
  };
};
