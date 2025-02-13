import { Progress } from "@/components/ui/progress";
import { notify } from "@/services/notifications";
import { saveAs } from "file-saver";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type DownloadableItem = {
  id: number;
  name?: string;
  filename?: string;
};

type DownloadFunction = (
  id: number,
  setProgress: (progress: number) => void
) => Promise<{ blob: Blob; filename?: string }>;

export const useDownloadWithProgress = <T extends DownloadableItem>(
  downloadFunction: DownloadFunction,
  item: T
) => {
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const toastId = useRef<string | number | null>(null);

  const handleDownload = async () => {
    try {
      setDownloadProgress(0);

      toastId.current = toast(
        <div>
          <p>Descargando {item.name || item.filename}...</p>
          <Progress value={0} className="mt-2" />
        </div>,
        {
          duration: Infinity, // Toast doesn't auto-hide
        }
      );

      const { blob, filename } = await downloadFunction(
        item.id,
        setDownloadProgress
      );

      saveAs(blob, filename || `${item.name || item.filename}`);
      setDownloadProgress(null);

      notify.success("Descarga completada");
    } catch (error) {
      notify.error("No se pudo descargar.");
      console.error(error);
      setDownloadProgress(null);
    } finally {
      if (toastId.current !== null) {
        toast.dismiss(toastId.current);
      }
    }
  };

  // Update existing toast with download progress
  useEffect(() => {
    if (downloadProgress !== null && toastId.current !== null) {
      toast(
        <div>
          <p>Descargando {item.name || item.filename}...</p>
          <Progress value={downloadProgress} className="mt-2" />
        </div>,
        {
          id: toastId.current,
          duration: Infinity,
        }
      );
    }
  }, [downloadProgress, item.name, item.filename]);

  return { handleDownload, downloadProgress };
};
