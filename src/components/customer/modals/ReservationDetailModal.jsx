/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Car,
  Wrench,
  AlertCircle,
  Info,
  User,
  NotebookText,
  CalendarDays,
} from "lucide-react";

const ReservationDetailModal = ({
  reservation,
  formatDate,
  getServiceTypeBadge,
  getStatusBadge,
}) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Badge
          variant="outline"
          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
        >
          <Info className="h-4 w-4" />
        </Badge>
      </DialogTrigger>
      <DialogContent className="min-w-[90vw] sm:min-w-[70vw] lg:min-w-[60vw]">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg sm:text-xl font-semibold">
            Detail Reservasi
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Informasi lengkap reservasi servis kendaraan
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-2 pr-4">
            {/* Kolom Kiri */}
            <div className="space-y-4">
              {/* Tanggal & Waktu */}
              <div className="flex items-start gap-4">
                <div className="border border-primary/20 p-2 rounded-md mt-0.5">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base mb-1.5">
                    Tanggal & Waktu
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                      {formatDate(reservation.date)}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4 opacity-70" />
                      {reservation.time}
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Jenis Servis */}
              <div className="flex items-start gap-4">
                <div className="border border-primary/20 p-2 rounded-md mt-0.5">
                  <Wrench className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base mb-1.5">
                    Jenis Servis
                  </h4>
                  <div className="mt-1">
                    {getServiceTypeBadge(reservation.serviceType)}
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Status */}
              <div className="flex items-start gap-4">
                <div className="border border-primary/20 p-2 rounded-md mt-0.5">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base mb-1.5">
                    Status Reservasi
                  </h4>
                  <div className="mt-1">
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Mekanik */}
              {reservation.Mechanic && (
                <div className="flex items-start gap-4">
                  <div className="border border-primary/20 p-2 rounded-md mt-0.5">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm sm:text-base mb-1.5">
                      Mekanik
                    </h4>
                    <div className="space-y-1 mt-1">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Nama:</span>{" "}
                        <span className="font-medium">
                          {reservation.Mechanic.name}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Telepon:</span>{" "}
                        <span className="font-medium">
                          {reservation.Mechanic.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-4">
              {/* Kendaraan */}
              <div className="flex items-start gap-4">
                <div className="border border-primary/20 p-2 rounded-md mt-0.5">
                  <Car className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base mb-1.5">
                    Kendaraan
                  </h4>
                  <div className="grid grid-cols-1 gap-y-2 mt-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Merek:</span>{" "}
                      <span className="font-medium">
                        {reservation.Vehicle.brand}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tipe:</span>{" "}
                      <span className="font-medium">
                        {reservation.Vehicle.type}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tahun:</span>{" "}
                      <span className="font-medium">
                        {reservation.Vehicle.productionYear}
                      </span>
                    </div>
                    {reservation.Vehicle.licensePlate && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Plat Nomor:
                        </span>{" "}
                        <span className="font-medium">
                          {reservation.Vehicle.licensePlate}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="my-2" />

              {/* Gejala */}
              <div className="flex items-start gap-4">
                <div className="border border-primary/20 p-2 rounded-md mt-0.5">
                  <AlertCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm sm:text-base mb-1.5">
                    Gejala
                  </h4>
                  {reservation.Symptoms.length > 0 ? (
                    <ul className="space-y-2 pl-1 mt-1">
                      {reservation.Symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span className="text-sm">{symptom.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-muted-foreground mt-1">
                      Tidak ada gejala tercatat
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Catatan */}
              {reservation.serviceDetail && (
                <div className="flex items-start gap-4">
                  <div className="border border-primary/20 p-2 rounded-md mt-0.5">
                    <NotebookText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm sm:text-base mb-1.5">
                      Catatan Tambahan
                    </h4>
                    <div className="text-sm bg-muted/20 p-3 rounded-md mt-1 whitespace-pre-wrap">
                      {reservation.serviceDetail}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationDetailModal;
