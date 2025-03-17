import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/services/api";

const useReservationUser = () => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReservationData = useCallback(async () => {
    try {
      const response = await api.get("/reservations/my-reservations");
      setReservation(response.data.data);
    } catch (error) {
      console.error("Error fetching reservation data:", error);
      setReservation(null);
      toast.error("Gagal memuat data reservasi.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleCancelReservation = useCallback(
    async (reservationId) => {
      if (!window.confirm("Apakah Anda yakin ingin membatalkan reservasi?")) {
        return;
      }
      try {
        await api.delete(`/reservations/${reservationId}`);
        toast.success("Reservasi berhasil dibatalkan.");
        fetchReservationData(); // Memuat ulang data reservasi setelah pembatalan
      } catch (error) {
        console.error("Error canceling reservation:", error);
        toast.error("Gagal membatalkan reservasi.");
      }
    },
    [fetchReservationData]
  );

  return {
    reservation,
    loading,
    fetchReservationData,
    handleCancelReservation,
  };
};

export default useReservationUser;
