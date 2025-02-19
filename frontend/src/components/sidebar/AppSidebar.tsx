import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavFolderOptions } from "./components/NavFolderOptions";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <NavFolderOptions />
      </SidebarHeader>

      <SidebarContent></SidebarContent>

      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};
