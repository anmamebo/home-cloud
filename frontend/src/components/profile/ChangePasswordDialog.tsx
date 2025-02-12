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
import { ChangePasswordForm } from "./ChangePasswordForm";

export const ChangePasswordDialog = ({ open, onOpenChange }: DialogProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return createPortal(
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          {/* Header */}
          <DrawerHeader className="text-left">
            <DrawerTitle>Cambiar contraseña</DrawerTitle>
            <DrawerDescription>
              Realiza cambios en tu contraseña aquí. Haz clic en actualizar
              cuando termines.
            </DrawerDescription>
          </DrawerHeader>

          {/* Content */}
          <div className="px-4">
            <ChangePasswordForm />
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
          <DialogTitle>Cambiar contraseña</DialogTitle>
          <DialogDescription>
            Realiza cambios en tu contraseña aquí. Haz clic en actualizar cuando
            termines.
          </DialogDescription>
        </DialogHeader>

        {/* Content */}
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>,
    document.body
  );
};
