import {
  ContextMenuContentComponent,
  FileDropdownMenu,
} from "@/components/file";
import { Card, CardContent } from "@/components/ui/card";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { downloadFile } from "@/services/fileService";
import { notify } from "@/services/notifications";
import { File } from "@/types";
import { saveAs } from "file-saver";
import { FileIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type FileItemProps = {
  file: File;
};

export const FileItem = ({ file }: FileItemProps) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const toastId = useRef<string | number | null>(null);

  const handleDownload = async () => {
    try {
      setDownloadProgress(0);

      toastId.current = toast(
        <div>
          <p>Descargando {file.filename}...</p>
          <Progress value={0} className="mt-2" />
        </div>,
        {
          duration: Infinity, // Toast doesn't close automatically
        }
      );

      const { blob, filename } = await downloadFile(
        file.id,
        setDownloadProgress
      );

      saveAs(blob, filename || `${file.filename}`);
      setDownloadProgress(null);
      toast.dismiss(toastId.current);
      notify.success("Descarga completada");
    } catch (error) {
      notify.error("No se pudo descargar la carpeta.");
      console.error(error);
      setDownloadProgress(null);
    }
  };

  useEffect(() => {
    if (downloadProgress !== null && toastId.current !== null) {
      toast(
        <div>
          <p>Descargando {file.filename}...</p>
          <Progress value={downloadProgress} className="mt-2" />
        </div>,
        {
          id: toastId.current, // Use the same toast ID to update the existing toast
          duration: Infinity,
        }
      );
    }
  }, [downloadProgress, file.filename]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card
          className="p-4 cursor-pointer hover:bg-muted/40 transition-colors"
          role="button"
          tabIndex={0}
        >
          <CardContent className="flex items-center gap-4 p-0">
            {/* Icon */}
            <div className="flex-none">
              <FileIcon size={22} />
            </div>

            {/* Name */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex-grow truncate text-md font-medium select-none">
                    {file.filename}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">{file.filename}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Actions */}
            <div className="flex-none">
              <FileDropdownMenu
                file={file}
                onDownload={handleDownload}
                onRename={() => {}}
                onDetails={() => {}}
                onActivity={() => {}}
                onMoveToTrash={() => {}}
              />
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>

      {/* Context Menu Actions */}
      <ContextMenuContentComponent
        file={file}
        onDownload={handleDownload}
        onRename={() => {}}
        onDetails={() => {}}
        onActivity={() => {}}
        onMoveToTrash={() => {}}
      />
    </ContextMenu>
  );
};
