import {
  CodeIcon,
  FileIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FolderArchiveIcon,
  ImageIcon,
  MusicIcon,
  VideoIcon,
} from "lucide-react";

const fileIcons: { [key: string]: React.ComponentType } = {
  // Documents
  pdf: FileTextIcon,
  doc: FileTextIcon,
  docx: FileTextIcon,
  txt: FileTextIcon,

  // Images
  jpg: ImageIcon,
  jpeg: ImageIcon,
  png: ImageIcon,
  gif: ImageIcon,
  bmp: ImageIcon,
  svg: ImageIcon,

  // Audio
  mp3: MusicIcon,
  wav: MusicIcon,
  ogg: MusicIcon,

  // Video
  mp4: VideoIcon,
  mov: VideoIcon,
  avi: VideoIcon,
  mkv: VideoIcon,

  // Compressed files
  zip: FolderArchiveIcon,
  rar: FolderArchiveIcon,
  tar: FolderArchiveIcon,
  gz: FolderArchiveIcon,

  // Code
  js: CodeIcon,
  ts: CodeIcon,
  html: CodeIcon,
  css: CodeIcon,
  json: CodeIcon,
  py: CodeIcon,

  // Spreadsheets
  xls: FileSpreadsheetIcon,
  xlsx: FileSpreadsheetIcon,
  csv: FileSpreadsheetIcon,

  // Default
  default: FileIcon,
};

export const getFileIcon = (filename: string): React.ComponentType => {
  const extension = filename.split(".").pop()?.toLowerCase();
  return fileIcons[extension || "default"] || fileIcons.default;
};
