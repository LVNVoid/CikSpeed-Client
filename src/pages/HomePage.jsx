import { useEffect, useState } from "react";
import { toast } from "sonner";

import api from "@/services/api";

// Components
import UserInfoCard from "@/components/home/UserInfoCard";
import VehicleCard from "@/components/home/VehicleCard";
import ReservationCard from "@/components/home/ReservationCard";
import PageSkeleton from "@/components/skeletons/PageSkeleton";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchUserData(),
        fetchVehiclesData(),
        fetchReservationData(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }
  };

  const fetchVehiclesData = async () => {
    try {
      const response = await api.get("/vehicles/user");
      setVehicles(response.data);
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      setVehicles([]);
    }
  };

  const fetchReservationData = async () => {
    try {
      const response = await api.get("/reservations/my-reservations");
      setReservation(response.data.data);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
      setReservation(null);
    }
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) {
      return;
    }

    try {
      await api.delete(`/vehicles/${vehicleId}`);
      setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
      toast.success("Kendaraan berhasil dihapus");
    } catch (error) {
      console.error("Gagal menghapus kendaraan:", error);
      toast.error("Gagal menghapus kendaraan. Silakan coba lagi.");
    }
  };

  const handleVehicleAdded = (newVehicle) => {
    setVehicles([...vehicles, newVehicle]);
    toast.success("Kendaraan berhasil ditambahkan");
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-800 rounded-lg shadow-lg mb-8 p-6 text-white">
        <h1 className="text-2xl md:text-3xl font-bold">
          Selamat Datang, {user?.name || "Pengguna"}!
        </h1>
        <p className="mt-2">
          Selamat datang di layanan reservasi servis motor kami. Kami siap
          melayani kebutuhan perawatan kendaraan Anda.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UserInfoCard user={user} />
        <VehicleCard
          vehicles={vehicles}
          onDeleteVehicle={handleDeleteVehicle}
          onVehicleAdded={handleVehicleAdded}
        />
        <ReservationCard reservation={reservation} />
      </div>
      {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServicesCard />
        <PromoCard />
      </div>
      <div className="mt-8">
        <StatsCard />
      </div> */}
    </div>
  );
};

export default HomePage;
