import { useEffect } from "react";
import { toast } from "sonner";

import UserInfoCard from "@/components/customer/home/UserInfoCard";
import VehicleCard from "@/components/customer/home/VehicleCard";
import ReservationCard from "@/components/customer/home/ReservationCard";
import PageSkeleton from "@/components/skeletons/PageSkeleton";

import useReservationUser from "@/hooks/useReservationUser";
import useVehicles from "@/hooks/useVehicles";
import useUser from "@/hooks/useUser";

const HomePage = () => {
  const { user } = useUser();
  const {
    vehicles,
    loading: vehiclesLoading,
    fetchVehiclesData,
    handleDeleteVehicle,
    handleVehicleAdded,
  } = useVehicles();
  const {
    reservation,
    loading: reservationLoading,
    fetchReservationData,
    handleCancelReservation,
  } = useReservationUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchVehiclesData(), fetchReservationData()]);
      } catch (error) {
        toast.error("Gagal memuat data. Silakan coba lagi.");
      }
    };

    fetchData();
  }, [fetchVehiclesData, fetchReservationData]);

  if (vehiclesLoading || reservationLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Selamat Datang, {user?.name || "Pengguna"}!
        </h1>
        <p className="mt-2 text-muted-foreground">
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
        <ReservationCard
          reservation={reservation}
          onCancelReservation={handleCancelReservation}
        />
      </div>
    </div>
  );
};

export default HomePage;
