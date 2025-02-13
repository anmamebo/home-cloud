import { ChangeNameFileForm } from "@/components/file";
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

type ChangeNameFileDialogProps = {
  fileId: number;
  fileName: string;
} & DialogProps;

export const ChangeNameFileDialog = ({
  fileId,
  fileName,
  open,
  onOpenChange,
}: ChangeNameFileDialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return createPortal(
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          {/* Header */}
          <DrawerHeader className="text-left">
            <DrawerTitle>Cambiar nombre del archivo</DrawerTitle>
            <DrawerDescription>
              Introduce el nuevo nombre del archivo.
            </DrawerDescription>
          </DrawerHeader>

          {/* Content */}
          <div className="px-4">
            <ChangeNameFileForm
              fileId={fileId}
              fileName={fileName}
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
          <DialogTitle>Cambiar nombre del archivo</DialogTitle>
          <DialogDescription>
            Introduce el nuevo nombre del archivo.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <ChangeNameFileForm
          fileId={fileId}
          fileName={fileName}
          onOpenChange={onOpenChange}
        />
      </DialogContent>
    </Dialog>,
    document.body
  );
};
