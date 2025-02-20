import { Order, SortByFile, SortByFolder } from "@/constants/SortConstants";

export type SortValue = `${SortByFolder | SortByFile}-${Order}`;

export type SortOption = {
  value: SortValue;
  label: string;
};

export type SortingOptions = {
  folders: SortByFolder;
  files: SortByFile;
  orderFolders: Order;
  orderFiles: Order;
};
