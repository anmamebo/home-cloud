import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CreateFolderDialog, UploadFileDialog } from "@/features/filesystem";
import { FileUpIcon, FolderUpIcon } from "lucide-react";
import { useState } from "react";

export const NavFolderOptions = () => {
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [isUploadFileDialogOpen, setIsUploadFileDialogOpen] = useState(false);

  return (
    <>
      <SidebarMenu>
        {/* Upload Folder */}
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            tooltip="Crear carpeta"
            onClick={() => setIsCreateFolderDialogOpen(true)}
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <FolderUpIcon className="size-4" />
            </div>
            <span className="truncate font-semibold text-md">
              Crear carpeta
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Upload File */}
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            tooltip="Subir archivo"
            onClick={() => setIsUploadFileDialogOpen(true)}
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <FileUpIcon className="size-4" />
            </div>
            <span className="truncate font-semibold text-md">
              Subir archivo
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Create Folder Dialog */}
      <CreateFolderDialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
      />

      {/* Upload File Dialog */}
      <UploadFileDialog
        open={isUploadFileDialogOpen}
        onOpenChange={setIsUploadFileDialogOpen}
      />
    </>
  );
};
