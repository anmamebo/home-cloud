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
import { useUploadWithProgress } from "@/hooks/useUploadWithProgress";
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
  const { folderId, fetchFolderContent } = useFolderContext();

  const { handleUpload, isUploading } = useUploadWithProgress(
    uploadFile,
    folderId
  );

  const form = useForm<UploadFileFormValues>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      files: [],
    },
  });

  const onSubmit = form.handleSubmit(async (values: UploadFileFormValues) => {
    try {
      await handleUpload(values.files);
      fetchFolderContent();
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
                name="files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Archivo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => {
                          const files = e.target.files;
                          if (files) {
                            field.onChange(Array.from(files));
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
