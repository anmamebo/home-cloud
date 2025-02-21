import { Progress } from "@/components/ui/progress";
import { notify } from "@/services/notifications";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

type UploadFunction<T> = (
  file: File,
  folderId: number,
  onUploadProgress: (progress: number) => void
) => Promise<T>;

export const useUploadWithProgress = <T extends { filename: string }>(
  uploadFunction: UploadFunction<T>,
  folderId: number | null
) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const toastId = useRef<string | number | null>(null);

  const handleUpload = async (file: File) => {
    if (folderId === null) {
      notify.error("No se puede subir un archivo sin una carpeta destino.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    toastId.current = toast(
      <div className="flex flex-col w-full">
        <p>Subiendo {file.name}...</p>
        <Progress value={0} className="mt-2" />
      </div>,
      {
        duration: Infinity,
      }
    );

    try {
      const response = await uploadFunction(file, folderId, (progress) => {
        setUploadProgress(progress);
      });

      notify.success(`Archivo "${response.filename}" subido correctamente`);
      return response;
    } catch (error) {
      notify.error("No se pudo subir el archivo.");
      console.error(error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);

      if (toastId.current !== null) {
        toast.dismiss(toastId.current);
      }
    }
  };

  useEffect(() => {
    if (uploadProgress !== null && toastId.current !== null) {
      toast(
        <div className="flex flex-col w-full">
          <p>Subiendo...</p>
          <Progress value={uploadProgress} className="mt-2" />
        </div>,
        {
          id: toastId.current,
          duration: Infinity,
        }
      );
    }
  }, [uploadProgress]);

  return { handleUpload, isUploading, uploadProgress };
};
