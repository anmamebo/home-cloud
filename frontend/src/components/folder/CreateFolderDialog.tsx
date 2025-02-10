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
import { DialogProps } from "@/types/DialogPropsTypes";
import { createPortal } from "react-dom";
import { CreateFolderForm } from "./CreateFolderForm";

export const CreateFolderDialog = ({ open, onOpenChange }: DialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return createPortal(
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          {/* Header */}
          <DrawerHeader className="text-left">
            <DrawerTitle>Crear carpeta</DrawerTitle>
            <DrawerDescription>
              Crea una nueva carpeta para organizar tus archivos.
            </DrawerDescription>
          </DrawerHeader>

          {/* Content */}
          <div className="px-4">
            <CreateFolderForm onOpenChange={onOpenChange} />
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
          <DialogTitle>Crear carpeta</DialogTitle>
          <DialogDescription>
            Crea una nueva carpeta para organizar tus archivos.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <CreateFolderForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>,
    document.body
  );
};
