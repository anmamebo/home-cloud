import { CreateFolderDialog } from "@/components/folder/CreateFolderDialog";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { useState } from "react";

export const NavFolderOptions = () => {
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          {/* Create new folder */}
          <SidebarMenuButton
            size="lg"
            tooltip="Crear carpeta"
            onClick={() => setIsCreateFolderDialogOpen(true)}
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Plus className="size-4" />
            </div>
            <span className="truncate font-semibold text-md">
              Crear carpeta
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
      />
    </>
  );
};
