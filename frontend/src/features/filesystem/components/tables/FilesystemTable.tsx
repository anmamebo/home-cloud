import { DataTable } from "@/components/shared/DataTable";
import { columns } from "@/features/filesystem";
import { File, Folder } from "@/types";

interface FilesystemTableProps {
  folders: Folder[];
  files: File[];
}

export const FilesystemTable = ({ folders, files }: FilesystemTableProps) => {
  const data = [...folders, ...files];

  return <DataTable columns={columns} data={data} />;
};
