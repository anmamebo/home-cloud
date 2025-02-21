import { SortDropdown } from "@/components/shared/SortDropdown";
import { FOLDER_SORT_OPTIONS } from "@/constants/SortConstants";
import { useSort } from "@/hooks/useSort";

export const FolderFilters = () => {
  const { selectedOrder, handleSortChange } = useSort("folders");

  return (
    <SortDropdown
      options={FOLDER_SORT_OPTIONS}
      value={selectedOrder}
      onChange={handleSortChange}
    />
  );
};
