import { File, Folder } from "@/types";

type FilesystemTableProps = {
  folders: Folder[];
  files: File[];
};

export const FilesystemTable = ({ folders, files }: FilesystemTableProps) => {
  console.log(folders, files);

  return <></>;
};
