import { useTheme } from "@/components/theme";
import {
  Theme,
  THEME_LABELS,
} from "@/components/theme/constants/ThemeConstants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { ChangePasswordDialog, ProfileDialog } from "@/features/user";
import {
  BadgeCheckIcon,
  KeyRoundIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { useState } from "react";

export const UserDropdown = () => {
  const { user, logout } = useAuth();

  const { theme, setTheme } = useTheme();

  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] =
    useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  if (!user) {
    return null;
  }

  const usernameFirstLetter = user.username.charAt(0).toUpperCase();

  return (
    <>
      <DropdownMenu>
        {/* Trigger */}
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        {/* Content */}
        <DropdownMenuContent
          className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          side="bottom"
          align="end"
          sideOffset={4}
        >
          {/* Label */}
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{usernameFirstLetter}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  ¡Hola, {user.username}!
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Menu Items */}
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
              <BadgeCheckIcon />
              Mi cuenta
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsChangePasswordDialogOpen(true)}
            >
              <KeyRoundIcon />
              Cambiar contraseña
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Theme Toggle */}
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                Cambiar tema
              </DropdownMenuSubTrigger>

              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuCheckboxItem
                    checked={theme === Theme.Light}
                    onCheckedChange={() => handleThemeChange(Theme.Light)}
                  >
                    {THEME_LABELS[Theme.Light]}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={theme === Theme.Dark}
                    onCheckedChange={() => handleThemeChange(Theme.Dark)}
                  >
                    {THEME_LABELS[Theme.Dark]}
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={theme === Theme.System}
                    onCheckedChange={() => handleThemeChange(Theme.System)}
                  >
                    {THEME_LABELS[Theme.System]}
                  </DropdownMenuCheckboxItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Log out */}
          <DropdownMenuItem onClick={logout}>
            <LogOutIcon />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Dialog */}
      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
      />

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={isChangePasswordDialogOpen}
        onOpenChange={setIsChangePasswordDialogOpen}
      />
    </>
  );
};
