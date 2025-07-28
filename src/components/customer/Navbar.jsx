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
import { Menu, X, User, Calendar, History, LogOut, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
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
    { label: "Beranda", path: "/home", icon: Home, visible: !!user },
    {
      label: "Reservasi",
      path: "/reservations",
      icon: Calendar,
      visible: !!user,
    },
    { label: "Riwayat", path: "/history", icon: History, visible: !!user },
  ];

  return (
    <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-sm bg-background/80 dark:bg-background/90">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-gradient">CikSpeed</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden p-2 rounded-md hover:bg-accent transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
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
                        ? "text-foreground bg-foreground/5"
                        : "text-foreground/80 hover:text-foreground hover:bg-foreground/5"
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
          {user ? (
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
                      +62{user?.phone}
                    </p>
                  </div>
                </DropdownMenuLabel>
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

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden mt-3 pt-4 pb-3 px-2 backdrop-blur-sm bg-background/80 dark:bg-background/90 shadow-md rounded-md border"
          >
            <nav className="flex flex-col space-y-1">
              {menuItems
                .filter((item) => item.visible)
                .map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-md font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-primary bg-primary/10"
                        : "hover:bg-primary/5"
                    }`}
                    onClick={closeMobileMenu}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                ))}

              {user ? (
                <>
                  <div className="h-px bg-border my-2" />
                  <button
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md font-medium text-red-500 hover:bg-red-500/5 w-full text-left mt-1 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Keluar
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    to="/login"
                    className="w-full"
                    onClick={closeMobileMenu}
                  >
                    <Button variant="outline" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link
                    to="/register"
                    className="w-full"
                    onClick={closeMobileMenu}
                  >
                    <Button className="w-full">Daftar</Button>
                  </Link>
                </div>
              )}
              <div className="pt-3 mt-1 flex justify-between items-center border-t">
                <p className="text-sm text-muted-foreground">Ubah tema</p>
                <ModeToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
