import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Menu,
  X,
  User,
  Calendar,
  History,
  LogOut,
  Home,
  Settings,
} from "lucide-react";
import api from "@/services/api";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Tutup menu mobile saat berpindah halaman
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      // Mengirim permintaan POST ke endpoint logout
      await api.post("/auth/logout");

      // Menghapus token JWT dari cookie
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // Menghapus user dari localStorage
      localStorage.removeItem("user");

      // Mengatur status login dan user
      setIsLoggedIn(false);
      setUser(null);

      // Navigasi ke halaman login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Anda bisa menambahkan penanganan kesalahan di sini jika diperlukan
    }
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { label: "Beranda", path: "/", icon: Home, visible: true },
    {
      label: "Reservasi",
      path: "/reservations",
      icon: Calendar,
      visible: isLoggedIn,
    },
    { label: "Riwayat", path: "/history", icon: History, visible: isLoggedIn },
  ];

  return (
    <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-sm bg-background/80 dark:bg-background/90">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <svg
            className="w-6 h-6 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.118 0-7.071 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            <span className="text-primary">Motor</span>
            <span className="text-foreground">Service</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 rounded-md hover:bg-accent transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Menu Navigasi Desktop */}
        <nav className="hidden sm:block">
          <ul className="flex items-center gap-1">
            {menuItems
              .filter((item) => item.visible)
              .map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-primary bg-primary/5"
                        : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="hidden sm:flex items-center gap-3">
          <ModeToggle />
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/10 hover:bg-primary/5"
                >
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block font-medium max-w-[120px] truncate">
                    {user?.name || "Pengguna"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.phone}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <User size={16} />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/reservations"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Calendar size={16} />
                    Reservasi Saya
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/history"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <History size={16} />
                    Riwayat Servis
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Settings size={16} />
                    Pengaturan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 cursor-pointer flex items-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full px-4"
                >
                  Masuk
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="rounded-full px-4 bg-primary hover:bg-primary/90"
                >
                  Daftar
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden mt-3 pt-4 pb-3 px-2 border-t backdrop-blur-sm bg-background/80 dark:bg-background/90">
          <nav className="flex flex-col space-y-1">
            {menuItems
              .filter((item) => item.visible)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-md font-medium ${
                    isActive(item.path)
                      ? "text-primary bg-primary/10"
                      : "hover:bg-primary/5"
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              ))}

            {isLoggedIn ? (
              <>
                <div className="h-px bg-border my-2"></div>
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-md font-medium ${
                    isActive("/profile")
                      ? "text-primary bg-primary/10"
                      : "hover:bg-primary/5"
                  }`}
                >
                  <User size={18} />
                  Profil Saya
                </Link>
                <Link
                  to="/settings"
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-md font-medium ${
                    isActive("/settings")
                      ? "text-primary bg-primary/10"
                      : "hover:bg-primary/5"
                  }`}
                >
                  <Settings size={18} />
                  Pengaturan
                </Link>
                <button
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md font-medium text-red-500 hover:bg-red-500/5 w-full text-left mt-1"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Keluar
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register" className="w-full">
                  <Button className="w-full">Daftar</Button>
                </Link>
              </div>
            )}
            <div className="pt-3 mt-1 flex justify-between items-center border-t">
              <p className="text-sm text-muted-foreground">Ubah tema</p>
              <ModeToggle />
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
