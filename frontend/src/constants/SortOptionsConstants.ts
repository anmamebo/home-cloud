import { SortOption } from "@/types";

export const FILE_SORT_OPTIONS: SortOption[] = [
  { value: "filename-asc", label: "Nombre: ascendente" },
  { value: "filename-desc", label: "Nombre: descendente" },
  { value: "created_at-desc", label: "Más reciente" },
  { value: "created_at-asc", label: "Más antiguo" },
  { value: "filesize-asc", label: "Menor tamaño" },
  { value: "filesize-desc", label: "Mayor tamaño" },
];

export const FOLDER_SORT_OPTIONS: SortOption[] = [
  { value: "name-asc", label: "Nombre: ascendente" },
  { value: "name-desc", label: "Nombre: descendente" },
  { value: "created_at-desc", label: "Más reciente" },
  { value: "created_at-asc", label: "Más antiguo" },
];
