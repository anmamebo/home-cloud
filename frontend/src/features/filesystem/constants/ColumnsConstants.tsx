import { File, Folder } from "@/types";
import { getFileIcon } from "@/utils/fileIconUtils";
import { formatDateTime, formatFileSize } from "@/utils/formatUtils";
import { ColumnDef } from "@tanstack/react-table";
import { FolderIcon } from "lucide-react";

export type FilesystemItem = Folder | File;

export const columns: ColumnDef<FilesystemItem>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => {
      const item = row.original;
      const Icon = "filename" in item ? getFileIcon(item.filename) : FolderIcon;
      const name = "filename" in item ? item.filename : item.name;

      return (
        <div className="flex gap-2 items-center font-semibold">
          <Icon />
          <span>{name}</span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "type",
  //   header: "Tipo",
  //   cell: ({ row }) => {
  //     const item = row.original;
  //     return "filename" in item ? "Archivo" : "Carpeta";
  //   },
  // },
  {
    accessorKey: "filesize",
    header: "Tamaño",
    cell: ({ row }) => {
      const item = row.original;
      return "filesize" in item ? formatFileSize(item.filesize) : "--";
    },
  },
  {
    accessorKey: "created_at",
    header: "Fecha de creación",
    cell: ({ row }) => {
      const item = row.original;
      return formatDateTime(item.created_at);
    },
  },
];
