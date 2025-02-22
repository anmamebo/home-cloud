import { Button } from "@/components/ui/button";
import { ViewMode } from "@/constants/ViewModeConstants";
import { useFolderContext } from "@/contexts/FolderContext";
import { AlignJustifyIcon, CheckIcon, LayoutGridIcon } from "lucide-react";

export const FilesystemHeader = () => {
  const { viewMode, setViewMode } = useFolderContext();

  return (
    <div className="flex justify-end">
      <Button variant="outline" onClick={() => setViewMode(ViewMode.GRID)}>
        {viewMode === ViewMode.GRID && <CheckIcon />}
        <LayoutGridIcon />
      </Button>
      <Button variant="outline" onClick={() => setViewMode(ViewMode.TABLE)}>
        {viewMode === ViewMode.TABLE && <CheckIcon />}
        <AlignJustifyIcon />
      </Button>
    </div>
  );
};
