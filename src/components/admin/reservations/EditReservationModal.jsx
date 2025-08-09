/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
import { id } from "date-fns/locale";
import api from "@/services/api";
import { toast } from "sonner";
import { CalendarIcon, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EditReservationModal = ({
  isOpen,
  onClose,
  reservationId,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [reservationExists, setReservationExists] = useState(true);

  // Format date for API requests
  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  // First check that the reservation exists
  useEffect(() => {
    if (reservationId) {
      api
        .get(`/reservations/${reservationId}`)
        .then(() => setReservationExists(true))
        .catch((error) => {
          if (error.response?.status === 404) {
            toast.error("Reservasi tidak ditemukan");
            setReservationExists(false);
            onClose(); // Close modal if reservation doesn't exist
          }
        });
    }
  }, [reservationId, onClose]);

  // Fetch reservation details and mechanics
  useEffect(() => {
    if (reservationId && reservationExists) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const mechanicsResponse = await api.get("/mechanics");
          setMechanics(mechanicsResponse.data);

          const reservationResponse = await api.get(
            `/reservations/${reservationId}`
          );
          const reservation = reservationResponse.data;

          setSelectedDate(new Date(reservation.date));
          setTime(reservation.time);
          setServiceType(reservation.serviceType);

          const mechId = reservation.mechanicId
            ? reservation.mechanicId.toString()
            : "";
          setMechanicId(mechId);
        } catch (error) {
          toast.error("Gagal memuat data reservasi");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [reservationId, reservationExists]);

  const fetchAvailableSlots = async (selectedDate) => {
    if (!selectedDate || !serviceType) return;

    setLoading(true);
    try {
      const response = await api.get("/reservations/available-slots", {
        params: {
          date: selectedDate,
          serviceType,
          reservationId,
        },
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error(
        error.response?.data?.error || "Failed to fetch available slots"
      );
      toast.error("Gagal memuat slot waktu yang tersedia");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formattedDate && serviceType) {
      fetchAvailableSlots(formattedDate);
    }
  }, [serviceType, formattedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      toast.error("Silakan pilih tanggal");
      return;
    }

    if (!time) {
      toast.error("Silakan pilih waktu");
      return;
    }

    if (!mechanicId) {
      toast.error("Silakan pilih mekanik");
      return;
    }

    const mechanicExists = mechanics.some(
      (m) => m.id.toString() === mechanicId.toString()
    );
    if (!mechanicExists) {
      toast.error("Mekanik tidak ditemukan");
      return;
    }

    if (serviceType === "major") {
      const allowedHours = ["13:00", "15:00"];
      if (!allowedHours.includes(time)) {
        toast.error("Servis besar hanya tersedia pada jam 13:00 dan 15:00");
        return;
      }
    }

    setLoading(true);

    const requestData = {
      date: formattedDate,
      time,
      serviceType,
      mechanicId: mechanicId.toString(),
    };

    try {
      await api.get(`/reservations/${reservationId}`);

      await api.put(`/reservations/${reservationId}`, requestData);

      toast.success("Reservasi berhasil diperbarui");
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Reservasi tidak ditemukan");
        onClose();
      } else if (error.response?.data?.error === "Mekanik tidak ditemukan") {
        toast.error(
          "Mekanik tidak ditemukan. Silakan pilih mekanik yang tersedia."
        );
      } else {
        toast.error(
          "Gagal memperbarui reservasi: " +
            (error.response?.data?.message || error.message)
        );
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isDateDisabled = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (reservationId) {
      const originalDate = new Date(selectedDate);
      originalDate.setHours(0, 0, 0, 0);
      if (date.getTime() === originalDate.getTime()) return false;
    }

    return date < today;
  };

  if (!reservationExists) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl">Edit Reservasi</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Tanggal */}
            <div>
              <Label htmlFor="date" className="text-sm font-medium">
                Pilih Tanggal
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: id })
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date);
                      setTime("");
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => isDateDisabled(date)}
                    initialFocus
                    className="border rounded-md"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Waktu */}
            <div>
              <Label className="text-sm font-medium">
                Pilih waktu operasional
              </Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {loading && !availableSlots.length ? (
                  <p className="text-center text-muted-foreground text-sm py-2 w-full">
                    Loading slots...
                  </p>
                ) : availableSlots.length > 0 ? (
                  availableSlots.map((slot) => {
                    const isDisabled =
                      serviceType === "major" &&
                      !["13:00", "15:00"].includes(slot);

                    return (
                      <Button
                        key={slot}
                        type="button"
                        variant={time === slot ? "default" : "outline"}
                        className={cn(
                          "py-2 h-auto text-sm whitespace-nowrap",
                          isDisabled && "opacity-50 cursor-not-allowed",
                          time === slot && "font-medium"
                        )}
                        onClick={() => !isDisabled && setTime(slot)}
                        disabled={isDisabled}
                      >
                        {slot}
                      </Button>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground text-sm py-2 w-full">
                    No available slots for this date
                  </p>
                )}
              </div>
              {serviceType === "major" && (
                <p className="text-xs italic text-muted-foreground mt-2">
                  Servis besar hanya tersedia pada jam 13:00 dan 15:00
                </p>
              )}
            </div>

            {/* Jenis Servis */}
            <div>
              <Label htmlFor="serviceType" className="text-sm font-medium">
                Jenis Servis
              </Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger className="mt-1">
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
              <Label htmlFor="mechanicId" className="text-sm font-medium">
                Mekanik
              </Label>
              <Select value={mechanicId} onValueChange={setMechanicId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih mekanik" />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map((mechanic) => (
                    <SelectItem
                      key={mechanic.id}
                      value={mechanic.id.toString()}
                    >
                      {mechanic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Simpan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservationModal;
