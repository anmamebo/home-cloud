import { ReactNode } from "react";

type FilesystemSectionProps = {
  title: string;
  children: ReactNode;
  filters?: ReactNode;
};

export const FilesystemSection = ({
  title,
  children,
  filters,
}: FilesystemSectionProps) => {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-md font-semibold select-none">{title}</h3>

        {/* Filters */}
        {filters && <div className="flex gap-2">{filters}</div>}
      </div>

      {/* List */}
      {children}
    </div>
  );
};
