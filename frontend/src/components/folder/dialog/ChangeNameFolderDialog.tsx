import { ChangeNameFolderForm } from "@/components/folder";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useMobile";
import { DialogProps } from "@/types";
import { createPortal } from "react-dom";

type ChangeNameFolderDialogProps = {
  folderId: number;
  folderName: string;
} & DialogProps;

export const ChangeNameFolderDialog = ({
  folderId,
  folderName,
  open,
  onOpenChange,
}: ChangeNameFolderDialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return createPortal(
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          {/* Header */}
          <DrawerHeader className="text-left">
            <DrawerTitle>Cambiar nombre de la carpeta</DrawerTitle>
            <DrawerDescription>
              Introduce el nuevo nombre de la carpeta.
            </DrawerDescription>
          </DrawerHeader>

          {/* Content */}
          <div className="px-4">
            <ChangeNameFolderForm
              folderId={folderId}
              folderName={folderName}
              onOpenChange={onOpenChange}
            />
          </div>

          {/* Footer */}
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>,
      document.body
    );
  }

  return createPortal(
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Cambiar nombre de la carpeta</DialogTitle>
          <DialogDescription>
            Introduce el nuevo nombre de la carpeta.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <ChangeNameFolderForm
          folderId={folderId}
          folderName={folderName}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>,
    document.body
  );
};
