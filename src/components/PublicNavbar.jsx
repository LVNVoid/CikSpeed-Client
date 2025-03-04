import { Link } from "react-router-dom";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const PublicNavbar = () => {
  return (
    <div className="container mx-auto py-3 px-4 sm:px-6 lg:px-8 border-t backdrop-blur-sm bg-background/80 dark:bg-background/90">
      <div className="flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <span>
            <span className="text-gradient">CikSpeed</span>
          </span>
        </Link>

        {/* User Section */}
        <div className="flex items-center gap-3">
          <ModeToggle />

          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-full px-4">
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
        </div>
      </div>
    </div>
  );
};

export default PublicNavbar;
