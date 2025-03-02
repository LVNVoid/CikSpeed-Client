import { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  AlertTriangle,
  Info,
  Car,
  Wrench,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import api from "@/services/api";
import {
  capitalizeFirstLetter,
  getStatusBadgeVariant,
  getTranslatedStatus,
} from "@/lib/utils";

const ReservationDetailModal = ({ isOpen, onClose, reservationId }) => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservationDetail = async () => {
      if (!reservationId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/reservations/${reservationId}`);
        setReservation(response.data);
      } catch (error) {
        setError(
          error.response?.data?.error ||
            "Terjadi kesalahan saat mengambil detail reservasi"
        );
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && reservationId) {
      fetchReservationDetail();
    }
  }, [isOpen, reservationId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Tidak tersedia";

    try {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch (error) {
      return "Format tanggal tidak valid";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Tidak tersedia";
    return timeString.substring(0, 5);
  };

  const getServiceTypeBadge = (serviceType) => {
    switch (serviceType) {
      case "major":
        return (
          <Badge variant="info" className="rounded-full">
            Servis Besar
          </Badge>
        );
      case "regular":
        return (
          <Badge variant="purple" className="rounded-full">
            Servis Ringan
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className="rounded-full">
            {serviceType || "Tidak diketahui"}
          </Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Reservasi</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 boerder-primary"></div>
            <p className="mt-4 text-foreground">Memuat detail reservasi...</p>
          </div>
        ) : error ? (
          <div className="py-6 px-4 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-red-600 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-600">{error}</p>
            <Button variant="outline" className="mt-4" onClick={onClose}>
              Tutup
            </Button>
          </div>
        ) : reservation ? (
          <div className="grid gap-6 py-4">
            {/* Status Reservasi */}
            <div className="flex items-center justify-between px-1">
              <div className="flex flex-col">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Status Reservasi
                </h3>
                <Badge
                  variant={getStatusBadgeVariant(
                    reservation.status || "pending"
                  )}
                  className="mt-1 w-fit"
                >
                  {capitalizeFirstLetter(
                    getTranslatedStatus(reservation.status || "pending")
                  )}
                </Badge>
              </div>
              <div className="text-right">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ID Reservasi
                </h3>
                <p className="font-mono text-sm">
                  #{(reservation.id || 0).toString().padStart(5, "0")}
                </p>
              </div>
            </div>

            <Separator />

            {/* Informasi Waktu dan Tanggal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Tanggal Reservasi
                    </p>
                    <p className="font-medium">
                      {formatDate(reservation.date)}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Waktu</p>
                    <p className="font-medium">
                      {formatTime(reservation.time)} WIB
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Informasi Layanan */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <Wrench className="mr-2 h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Informasi Layanan</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Jenis Servis
                    </p>
                    <div className="mt-1">
                      {getServiceTypeBadge(reservation.serviceType)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mekanik</p>
                    {reservation.Mechanic ? (
                      <div className="flex items-center mt-1">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback>
                            {reservation.Mechanic.name
                              ? reservation.Mechanic.name
                                  .substring(0, 2)
                                  .toUpperCase()
                              : "MK"}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {reservation.Mechanic.name || "Nama tidak tersedia"}
                        </span>
                      </div>
                    ) : (
                      <p className="text-muted-foreground italic mt-1">
                        Belum ditugaskan
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informasi Kendaraan */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <Car className="mr-2 h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Informasi Kendaraan</h3>
                </div>
                {reservation.Vehicle ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Merek</p>
                      <p className="font-medium">
                        {reservation.Vehicle.brand || "Tidak tersedia"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipe</p>
                      <p className="font-medium">
                        {reservation.Vehicle.type || "Tidak tersedia"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tahun</p>
                      <p className="font-medium">
                        {reservation.Vehicle.productionYear || "Tidak tersedia"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted p-4 rounded-md flex items-center justify-center">
                    <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Data kendaraan tidak tersedia
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Gejala */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="mr-2 h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">Gejala</h3>
                </div>
                <div className="space-y-2">
                  {reservation.Symptoms && reservation.Symptoms.length > 0 ? (
                    reservation.Symptoms.map((symptom) => (
                      <div
                        key={symptom.id}
                        className="flex items-start bg-muted p-3 rounded-md"
                      >
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-orange-500 mr-3"></div>
                        <p>{symptom.name || "Tidak tersedia"}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">
                      Tidak ada gejala yang dilaporkan
                    </p>
                  )}
                  {reservation.description &&
                  reservation.description.trim() !== "" ? (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-1">
                        Catatan Tambahan:
                      </p>
                      <p className="bg-muted p-3 rounded-md">
                        {reservation.description}
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            {/* Footer Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Tutup
              </Button>
              <Button>Ubah Status</Button>
            </div>
          </div>
        ) : (
          <div className="py-6 px-4 text-center">
            <p className="text-muted-foreground">Tidak ada data</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetailModal;
