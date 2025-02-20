import { SortDropdown } from "@/components/shared/SortDropdown";
import { FILE_SORT_OPTIONS } from "@/constants/SortConstants";
import { useSort } from "@/hooks/useSort";

export const FileFilters = () => {
  const { selectedOrder, handleSortChange } = useSort("files");

  return (
    <SortDropdown
      options={FILE_SORT_OPTIONS}
      value={selectedOrder}
      onChange={handleSortChange}
    />
  );
};
