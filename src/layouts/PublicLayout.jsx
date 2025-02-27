import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      {/* Konten utama */}
      <main className="flex-1 container mx-auto px-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
