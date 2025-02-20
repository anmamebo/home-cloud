import { Order, SortByFile, SortByFolder } from "@/constants/SortConstants";
import { useFolderContext } from "@/contexts/FolderContext";
import { SortValue } from "@/types";

export const useSort = (type: "files" | "folders") => {
  const { sortBy, setSortBy } = useFolderContext();

  const selectedOrder =
    type === "files"
      ? (`${sortBy.files}-${sortBy.orderFiles}` as SortValue)
      : (`${sortBy.folders}-${sortBy.orderFolders}` as SortValue);

  const handleSortChange = (value: string) => {
    const [sortByType, order] = value.split("-") as [
      SortByFile | SortByFolder,
      Order
    ];
    setSortBy({
      ...sortBy,
      [type]: sortByType,
      [`order${type.charAt(0).toUpperCase() + type.slice(1)}`]: order,
    });
  };

  return { selectedOrder, handleSortChange };
};
