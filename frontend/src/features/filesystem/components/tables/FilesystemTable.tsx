import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { File, Folder } from "@/types";
import { getFileIcon } from "@/utils/fileIconUtils";
import { formatDateTime, formatFileSize } from "@/utils/formatUtils";
import { FolderIcon } from "lucide-react";

type FilesystemTableProps = {
  folders: Folder[];
  files: File[];
};

export const FilesystemTable = ({ folders, files }: FilesystemTableProps) => {
  console.log(folders, files);

  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Tamaño</TableHead>
          <TableHead>Fecha de creación</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {folders.map((folder) => (
          <TableRow key={folder.id}>
            <TableCell className="flex items-center gap-2">
              <FolderIcon />
              {folder.name}
            </TableCell>
            <TableCell>{"--"}</TableCell>
            <TableCell>{formatDateTime(folder.created_at)}</TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}

        {files.map((file) => {
          const FileIcon = getFileIcon(file.filename);
          return (
            <TableRow key={file.id}>
              <TableCell className="flex items-center gap-2">
                <FileIcon />
                {file.filename}
              </TableCell>
              <TableCell>{formatFileSize(file.filesize)}</TableCell>
              <TableCell>{formatDateTime(file.created_at)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          );
        })}
      </TableBody>

      <TableFooter></TableFooter>
    </Table>
  );
};
