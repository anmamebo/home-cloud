import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption, SortValue } from "@/types";
import React from "react";

type SortItemsProps = {
  options: SortOption[];
  defaultOption: SortValue;
  onSortChange: (value: SortValue) => void;
  align?: "start" | "center" | "end";
};

export const SortItems = React.memo(
  ({ options, defaultOption, onSortChange, align = "end" }: SortItemsProps) => {
    const handleSortChange = (value: SortValue) => {
      onSortChange(value);
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="link">
            Ordenar por:{" "}
            {options.find((option) => option.value === defaultOption)?.label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          <DropdownMenuRadioGroup
            value={defaultOption}
            onValueChange={(value) => handleSortChange(value as SortValue)}
          >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.label} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);
