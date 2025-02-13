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
import { updateFolder } from "@/services/folderService";
import { notify } from "@/services/notifications";
import { getErrorMessage } from "@/utils/errorUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().nonempty("El nombre de la carpeta es requerido"),
});

interface ChangeNameFolderFormProps {
  folderId: number;
  folderName: string;
  onOpenChange: (open: boolean) => void;
}

export const ChangeNameFolderForm = ({
  folderId,
  folderName,
  onOpenChange,
}: ChangeNameFolderFormProps) => {
  const { refreshFolders } = useFolderContext();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: folderName,
    },
  });

  const onSubmit = form.handleSubmit(
    async (values: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      try {
        const response = await updateFolder(folderId, values.name);
        const { name: folderName } = response;

        notify.success(`Carpeta "${folderName}" actualizada correctamente`);

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
