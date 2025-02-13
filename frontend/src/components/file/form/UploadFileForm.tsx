import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useFolderContext } from "@/contexts/FolderContext";
import { uploadFile } from "@/services/fileService";
import { notify } from "@/services/notifications";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  file: z.instanceof(File, { message: "Debes seleccionar un archivo" }),
});

interface UploadFileFormProps {
  onOpenChange: (open: boolean) => void;
}

export const UploadFileForm = ({ onOpenChange }: UploadFileFormProps) => {
  const { refreshFolders, currentFolderId } = useFolderContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const toastId = useRef<string | number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      setUploadProgress(0);

      toastId.current = toast(
        <div>
          <p>Subiendo {values.file.name}...</p>
          <Progress value={uploadProgress} className="mt-2" />
        </div>,
        {
          duration: Infinity, // El toast no se cierra automáticamente
        }
      );

      try {
        const response = await uploadFile(
          values.file,
          currentFolderId,
          (progress) => {
            setUploadProgress(progress);
          }
        );
        const { filename } = response;

        notify.success(`Archivo "${filename}" subido correctamente`);

        refreshFolders();

        form.reset();
        onOpenChange(false);
      } catch (error) {
        notify.error(getErrorMessage(error));
        console.error(error);
      } finally {
        setIsSubmitting(false);
        setUploadProgress(null);

        if (toastId.current !== null) {
          toast.dismiss(toastId.current);
        }
      }
    }
  );

  // Actualizar el toast cuando cambia el progreso
  useEffect(() => {
    if (uploadProgress !== null && toastId.current !== null) {
      toast(
        <div>
          <p>Subiendo {form.getValues("file")?.name}...</p>
          <Progress value={uploadProgress} className="mt-2" />
        </div>,
        {
          id: toastId.current,
          duration: Infinity,
        }
      );
    }
  }, [uploadProgress, form]);

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Archivo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            field.onChange(file);
                          }
                        }}
                        accept="*"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Subiendo..." : "Subir archivo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
