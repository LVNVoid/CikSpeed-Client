import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/services/api";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVehiclesData = useCallback(async () => {
    try {
      const response = await api.get("/vehicles/user");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setVehicles([]);
      toast.error("Gagal memuat data kendaraan.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteVehicle = useCallback(async (vehicleId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) {
      return;
    }

    try {
      await api.delete(`/vehicles/${vehicleId}`);
      setVehicles((prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle.id !== vehicleId)
      );
      toast.success("Kendaraan berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus kendaraan:", error);
      toast.error("Gagal menghapus kendaraan. Silakan coba lagi.");
    }
  }, []);

  const handleVehicleAdded = useCallback((newVehicle) => {
    setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    toast.success("Kendaraan berhasil ditambahkan");
  }, []);

  return {
    vehicles,
    loading,
    fetchVehiclesData,
    handleDeleteVehicle,
    handleVehicleAdded,
  };
};

export default useVehicles;
