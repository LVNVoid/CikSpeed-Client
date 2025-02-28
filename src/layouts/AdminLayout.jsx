import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import SidebarAdmin from "@/components/admin/SidebarAdmin";
import HeaderAdmin from "@/components/admin/HeaderAdmin";

const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const contentVariants = {
    open: {
      marginLeft: "240px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      marginLeft: "0px",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <HeaderAdmin toggleSidebar={toggleSidebar} />

      {/* Sidebar - Mobile */}
      <SidebarAdmin isOpen={isOpen} mobile={true} />

      {/* Sidebar - Desktop */}
      <SidebarAdmin isOpen={false} mobile={false} />

      {/* Main Content */}
      <motion.main
        className="pt-20 px-4 pb-8 lg:ml-60"
        variants={contentVariants}
        animate={isOpen ? "open" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout;
