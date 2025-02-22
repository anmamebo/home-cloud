import { ChangeNameForm } from "@/features/filesystem";
import { updateFolder } from "@/services/folderService";

interface ChangeNameFolderFormProps {
  folderId: number;
  folderName: string;
  onOpenChange: (open: boolean) => void;
}

export const ChangeNameFolderForm = ({
  folderId,
  folderName,
  onOpenChange,
}: ChangeNameFolderFormProps) => {
  return (
    <ChangeNameForm
      itemId={folderId}
      itemName={folderName}
      onOpenChange={onOpenChange}
      updateItem={updateFolder}
    />
  );
};
