import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVerticalIcon } from "lucide-react";
import { ReactNode } from "react";

type DropdownItemMenuProps = {
  children: ReactNode;
};

export const ItemDropdownMenu = ({ children }: DropdownItemMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <EllipsisVerticalIcon size={18} />
        </Button>
      </DropdownMenuTrigger>

      {children}
    </DropdownMenu>
  );
};
