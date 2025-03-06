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

  return {
    reservation,
    loading,
    fetchReservationData,
  };
};

export default useReservationUser;
