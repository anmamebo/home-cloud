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
import { UploadFileForm } from "@/features/filesystem";
import { useIsMobile } from "@/hooks/useMobile";
import { DialogProps } from "@/types";
import { createPortal } from "react-dom";

export const UploadFileDialog = ({ open, onOpenChange }: DialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return createPortal(
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          {/* Header */}
          <DrawerHeader className="text-left">
            <DrawerTitle>Subir archivo/s</DrawerTitle>
            <DrawerDescription>
              Elige un archivo para subir a tu carpeta.
            </DrawerDescription>
          </DrawerHeader>

          {/* Content */}
          <div className="px-4">
            <UploadFileForm onOpenChange={onOpenChange} />
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
          <DialogTitle>Subir archivo/s</DialogTitle>
          <DialogDescription>
            Elige un archivo para subir a tu carpeta.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <UploadFileForm onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>,
    document.body
  );
};
