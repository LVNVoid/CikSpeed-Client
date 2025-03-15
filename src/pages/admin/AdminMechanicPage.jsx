import useMechanics from "@/hooks/useMechanics";
import api from "@/services/api";
import { useState } from "react";
import { motion } from "framer-motion";
import MechanicCard from "@/components/admin/mechanics/MechanicCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AddMechanicModal from "@/components/admin/mechanics/AddMechanicModal";
import EditMechanicModal from "@/components/admin/mechanics/EditMechanicModal";
import { Button } from "@/components/ui/button";
import { AlertCircle, PlusCircle, RefreshCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AdminMechanicPage = () => {
  const { mechanics, loading, error, fetchMechanics, setMechanics } =
    useMechanics();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentMechanic, setCurrentMechanic] = useState(null);

  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  const handleAddMechanic = async (newMechanic) => {
    try {
      const response = await api.post("/mechanics", newMechanic);
      setMechanics([...mechanics, response.data]);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat menambahkan mekanik"
      );
    }
  };

  const handleEditMechanic = async (updatedMechanic) => {
    try {
      const response = await api.put(
        `/mechanics/${updatedMechanic.id}`,
        updatedMechanic
      );
      setMechanics(
        mechanics.map((mechanic) =>
          mechanic.id === updatedMechanic.id ? response.data : mechanic
        )
      );
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat mengubah data mekanik"
      );
    }
  };

  const handleDeleteMechanic = async (id) => {
    try {
      await api.delete(`/mechanics/${id}`);
      setMechanics(mechanics.filter((mechanic) => mechanic.id !== id));
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat menghapus mekanik"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto py-8 px-4 md:px-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl text-foreground font-bold tracking-tight">
            Manajemen Mekanik
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola informasi mekanik bengkel
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMechanics}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={() => setAddModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Tambah Mekanik
            </Button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Mechanics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="ml-3 text-foreground">Memuat data mekanik...</p>
          </div>
        ) : mechanics.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-foreground">Tidak ada data mekanik</p>
          </div>
        ) : (
          mechanics.map((mechanic) => (
            <MechanicCard
              key={mechanic.id}
              mechanic={mechanic}
              onEdit={(mechanic) => {
                setCurrentMechanic(mechanic);
                setEditModalOpen(true);
              }}
              onDelete={handleDeleteMechanic}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>

      {/* Add Mechanic Modal */}
      <AddMechanicModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddMechanic}
      />

      {/* Edit Mechanic Modal */}
      <EditMechanicModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        mechanic={currentMechanic}
        onEdit={handleEditMechanic}
      />
    </motion.div>
  );
};

export default AdminMechanicPage;
