import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/useMobile";
import { DialogProps } from "@/types/DialogPropsTypes";
import { createPortal } from "react-dom";
import { CreateFolderForm } from "./CreateFolderForm";

export const CreateFolderDialog = ({ open, onOpenChange }: DialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <></>;
  }

  return createPortal(
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Crear carpeta</DialogTitle>
          <DialogDescription>
            Crea una nueva carpeta para organizar tus archivos
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <CreateFolderForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>,
    document.body
  );
};
