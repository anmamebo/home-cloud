import { ChangeNameForm } from "@/features/filesystem";
import { updateFile } from "@/services/fileService";

interface ChangeNameFileFormProps {
  fileId: number;
  fileName: string;
  onOpenChange: (open: boolean) => void;
}

export const ChangeNameFileForm = ({
  fileId,
  fileName,
  onOpenChange,
}: ChangeNameFileFormProps) => {
  return (
    <ChangeNameForm
      itemId={fileId}
      itemName={fileName}
      onOpenChange={onOpenChange}
      updateItem={updateFile}
      formatNewName={(name, extension) =>
        extension ? `${name}.${extension}` : name
      }
    />
  );
};
