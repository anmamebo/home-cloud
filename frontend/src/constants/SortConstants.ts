import { SortOption } from "@/types";

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export enum SortByFolder {
  CREATED_AT = "created_at",
  NAME = "name",
}

export enum SortByFile {
  CREATED_AT = "created_at",
  NAME = "filename",
  SIZE = "filesize",
}

export const FILE_SORT_OPTIONS: SortOption[] = [
  { value: `${SortByFile.NAME}-${Order.ASC}`, label: "Nombre: ascendente" },
  { value: `${SortByFile.NAME}-${Order.DESC}`, label: "Nombre: descendente" },
  { value: `${SortByFile.CREATED_AT}-${Order.DESC}`, label: "Más reciente" },
  { value: `${SortByFile.CREATED_AT}-${Order.ASC}`, label: "Más antiguo" },
  { value: `${SortByFile.SIZE}-${Order.DESC}`, label: "Tamaño: mayor" },
  { value: `${SortByFile.SIZE}-${Order.ASC}`, label: "Tamaño: menor" },
];

export const FOLDER_SORT_OPTIONS: SortOption[] = [
  { value: `${SortByFolder.NAME}-${Order.ASC}`, label: "Nombre: ascendente" },
  { value: `${SortByFolder.NAME}-${Order.DESC}`, label: "Nombre: descendente" },
  { value: `${SortByFolder.CREATED_AT}-${Order.DESC}`, label: "Más reciente" },
  { value: `${SortByFolder.CREATED_AT}-${Order.ASC}`, label: "Más antiguo" },
];
