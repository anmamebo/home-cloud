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
import { updateFile } from "@/services/fileService";
import { notify } from "@/services/notifications";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().nonempty("El nombre de la carpeta es requerido"),
});

interface ChangeNameFileFormProps {
  fileId: number;
  fileName: string;
  onOpenChange: (open: boolean) => void;
}

export const ChangeNameFileForm = ({
  fileId,
  fileName,
  onOpenChange,
}: ChangeNameFileFormProps) => {
  const { refreshFolders } = useFolderContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameParts = fileName.split(".");
  const hasExtension = nameParts.length > 1;
  const name = hasExtension ? nameParts.slice(0, -1).join(".") : fileName;
  const extension = hasExtension ? nameParts.pop()?.toLowerCase() : null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
    },
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      try {
        const response = await updateFile(
          fileId,
          extension ? `${values.name}.${extension}` : values.name
        );
        const { filename } = response;

        notify.success(`Archivo "${filename}" actualizado correctamente`);

        refreshFolders();

        form.reset();
        onOpenChange(false);
      } catch (error) {
        notify.error(getErrorMessage(error));
        console.error(error);
      } finally {
        setIsSubmitting(false);
      }
    }
  );

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form onSubmit={onSubmit}>
          {/* Form fields */}
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nuevo nombre" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Cambiando nombre..." : "Cambiar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
