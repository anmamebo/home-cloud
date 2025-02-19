import { Breadcrumbs } from "@/components/header/components/Breadcrumbs";
import { UserDropdown } from "@/components/header/components/UserDropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarIcon } from "lucide-react";

export const SiteHeader = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="fle sticky top-0 z-50 w-full items-center border-b bg-background">
      <div className="flex h-[--header-height] w-full items-center justify-between px-4">
        {/* Left */}
        <div className="flex items-center flex-1 gap-2">
          {/* Sidebar Trigger */}
          <Button
            className="h-8 w-8"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
          >
            <SidebarIcon />
          </Button>

          <Separator orientation="vertical" className="mr-2 h-4" />

          {/* Breadcrumb */}
          <Breadcrumbs />
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};
