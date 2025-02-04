import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  // This is sample data.
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>

      <SidebarContent></SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};
