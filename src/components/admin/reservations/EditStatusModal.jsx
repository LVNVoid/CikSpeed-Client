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
import api from "@/services/api";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const EditStatusModal = ({ isOpen, onClose, reservationId, onSuccess }) => {
  const [status, setStatus] = useState("");
  const [serviceDetail, setServiceDetail] = useState(""); // Catatan servis
  const [loading, setLoading] = useState(false);
  const [reservationExists, setReservationExists] = useState(true);

  useEffect(() => {
    if (reservationId && isOpen) {
      const fetchReservationData = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/reservations/${reservationId}`);
          setStatus(response.data.status || "");
          setServiceDetail(response.data.serviceDetail || ""); // Muat catatan yang ada
          setReservationExists(true);
        } catch (error) {
          if (error.response?.status === 404) {
            toast.error("Reservasi tidak ditemukan");
            setReservationExists(false);
            onClose();
          } else {
            toast.error("Gagal memuat data reservasi");
            onClose();
          }
        } finally {
          setLoading(false);
        }
      };

      fetchReservationData();
    }
  }, [reservationId, isOpen, onClose]);

  // Reset state ketika modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setStatus("");
      setServiceDetail("");
      setLoading(false);
      setReservationExists(true);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!status) {
      toast.error("Silakan pilih status");
      return;
    }

    if (status === "success" && !serviceDetail.trim()) {
      toast.error("Catatan servis wajib diisi saat status Selesai");
      return;
    }

    setLoading(true);

    try {
      await api.put(`/reservations/${reservationId}`, {
        status,
        serviceDetail: status === "success" ? serviceDetail : null, // Hanya kirim catatan jika selesai
      });

      toast.success("Reservasi berhasil diperbarui");
      onSuccess();
      onClose();
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Reservasi tidak ditemukan");
        onClose();
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

  if (!reservationExists) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl">Update Status Reservasi</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Status */}
            <div>
              <Label htmlFor="status" className="text-sm font-medium">
                Status Reservasi
              </Label>
              <Select
                value={status}
                onValueChange={setStatus}
                disabled={loading}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Menunggu Konfirmasi</SelectItem>
                  <SelectItem value="confirmed">Konfirmasi</SelectItem>
                  <SelectItem value="in_progress">Sedang Dikerjakan</SelectItem>
                  <SelectItem value="success">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Catatan servis jika status = success */}
            {status === "success" && (
              <div className="mt-4">
                <Label htmlFor="serviceDetail" className="text-sm font-medium">
                  Catatan Servis
                </Label>
                <Textarea
                  id="serviceDetail"
                  value={serviceDetail}
                  onChange={(e) => setServiceDetail(e.target.value)}
                  className="mt-1"
                  placeholder="Masukkan detail servis yang dilakukan..."
                  disabled={loading}
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading || !status}
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
                  Update Status
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStatusModal;
