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
import {
  CreateFolderFormValues,
  createFolderSchema,
} from "@/schemas/filesystemSchemas";
import { createFolder } from "@/services/folderService";
import { notify } from "@/services/notifications";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface CreateFolderFormProps {
  onOpenChange: (open: boolean) => void;
}

export const CreateFolderForm = ({ onOpenChange }: CreateFolderFormProps) => {
  const { folderId, fetchFolderContent } = useFolderContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateFolderFormValues>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values: CreateFolderFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await createFolder(values.name, folderId);
      const { name: folderName } = response;

      notify.success(`Carpeta "${folderName}" creada correctamente`);

      fetchFolderContent();

      form.reset();
      onOpenChange(false);
    } catch (error) {
      notify.error(getErrorMessage(error));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  });

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
                      <Input placeholder="Nueva Carpeta" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
