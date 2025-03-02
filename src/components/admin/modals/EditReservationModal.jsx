import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import api from "@/services/api";
import { toast } from "sonner";

const EditReservationModal = ({
  isOpen,
  onClose,
  reservationId,
  onSuccess,
}) => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [status, setStatus] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch reservation details and mechanics
  useEffect(() => {
    if (reservationId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const [reservationResponse, mechanicsResponse] = await Promise.all([
            api.get(`/reservations/${reservationId}`),
            api.get("/mechanics"),
          ]);

          const reservation = reservationResponse.data;
          setDate(new Date(reservation.date));
          setTime(reservation.time);
          setStatus(reservation.status);
          setServiceType(reservation.serviceType);
          setMechanicId(reservation.mechanicId);
          setMechanics(mechanicsResponse.data);
        } catch (error) {
          toast.error("Gagal memuat data reservasi");
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [reservationId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/reservations/${reservationId}`, {
        date: format(date, "yyyy-MM-dd"),
        time,
        status,
        serviceType,
        mechanicId,
      });

      toast.success("Reservasi berhasil diperbarui");
      onSuccess(); // Refresh data setelah berhasil
      onClose(); // Tutup modal
    } catch (error) {
      toast.error("Gagal memperbarui reservasi");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Reservasi</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Tanggal */}
            <div>
              <Label htmlFor="date">Tanggal</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => date < new Date()}
              />
            </div>

            {/* Waktu */}
            <div>
              <Label htmlFor="time">Waktu</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu Konfirmasi</SelectItem>
                  <SelectItem value="confirmed">Dikonfirmasi</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Jenis Servis */}
            <div>
              <Label htmlFor="serviceType">Jenis Servis</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis servis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Servis Ringan</SelectItem>
                  <SelectItem value="major">Servis Besar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mekanik */}
            <div>
              <Label htmlFor="mechanicId">Mekanik</Label>
              <Select value={mechanicId} onValueChange={setMechanicId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mekanik" />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservationModal;
