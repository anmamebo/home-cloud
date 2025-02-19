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
import { useFolderContext } from "@/contexts/FolderContext";
import { useUploadWithProgress } from "@/hooks/useUploadWithProgress"; // Importar el hook personalizado
import {
  UploadFileFormValues,
  uploadFileSchema,
} from "@/schemas/filesystemSchemas";
import { uploadFile } from "@/services/fileService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface UploadFileFormProps {
  onOpenChange: (open: boolean) => void;
}

export const UploadFileForm = ({ onOpenChange }: UploadFileFormProps) => {
  const { refreshFolders, currentFolderId } = useFolderContext();

  const { handleUpload, isUploading } = useUploadWithProgress(
    uploadFile,
    currentFolderId
  );

  const form = useForm<UploadFileFormValues>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = form.handleSubmit(async (values: UploadFileFormValues) => {
    try {
      await handleUpload(values.file);
      refreshFolders();
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  });

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

            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? "Subiendo..." : "Subir archivo"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
