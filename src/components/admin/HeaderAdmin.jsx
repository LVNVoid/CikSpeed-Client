import { User, Settings, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "../mode-toggle";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";
import { capitalizeFirstLetter, getRoleBadgeVariant } from "@/lib/utils";

const HeaderAdmin = ({ toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // Gunakan fungsi logout dari useAuth
      navigate("/login"); // Navigasi ke halaman login setelah logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="fixed w-full h-16 bg-background shadow-sm z-50 flex items-center justify-between px-4">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-2 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
            CikSpeed
          </h1>

          {/* Badge Role dipindahkan ke samping logo */}
          {user?.role && (
            <Badge
              variant={`${getRoleBadgeVariant(user.role)}`}
              className="text-xs md:text-sm" // Ukuran lebih kecil di mobile
            >
              {capitalizeFirstLetter(user.role)}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <NotificationDropdown />
        <ModeToggle />

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              {/* <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem> */}
              <DropdownMenuItem
                className="text-red-500 cursor-pointer flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default HeaderAdmin;
