import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Car,
  Wrench,
  AlertCircle,
  Info,
  User,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import api from "@/services/api";
import { Button } from "@/components/ui/button";

const HistoryReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryReservations = async () => {
      try {
        const response = await api.get("/reservations/history/user");
        setReservations(response.data);
      } catch (error) {
        console.error("Gagal mengambil data riwayat reservasi", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryReservations();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "success") {
      return <Badge variant={"success"}>Berhasil</Badge>;
    } else {
      return <Badge variant={"danger"}>Gagal</Badge>;
    }
  };

  const getServiceTypeBadge = (type) => {
    if (type === "major") {
      return (
        <Badge variant="info" className={"rounded-full"}>
          Servis Besar
        </Badge>
      );
    } else {
      return (
        <Badge variant="purple" className={"rounded-full"}>
          Servis Ringan
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Riwayat reservasi anda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/5">Tanggal & Waktu</TableHead>
                  <TableHead className="w-1/6">Jenis Servis</TableHead>
                  <TableHead className="w-1/5">Kendaraan</TableHead>
                  <TableHead className="w-1/5">Gejala</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                  <TableHead className="w-1/12">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24 mt-1" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Button disabled className="bg-gray-300 text-gray-500">
                        <Skeleton className="h-4 w-8" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Riwayat reservasi anda
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Tidak ada riwayat reservasi.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/5">Tanggal & Waktu</TableHead>
                  <TableHead className="w-1/6">Jenis Servis</TableHead>
                  <TableHead className="w-1/5">Kendaraan</TableHead>
                  <TableHead className="w-1/5">Gejala</TableHead>
                  <TableHead className="w-1/6">Status</TableHead>
                  <TableHead className="w-1/12">Detail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <Dialog key={reservation.id}>
                    <TableRow className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <div>
                            <div>{formatDate(reservation.date)}</div>
                            <div className="text-sm text-muted-foreground flex items-center mt-1">
                              <Clock className="mr-1 h-3 w-3" />{" "}
                              {reservation.time}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getServiceTypeBadge(reservation.serviceType)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {reservation.Vehicle.brand}{" "}
                            {reservation.Vehicle.type} (
                            {reservation.Vehicle.productionYear})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-h-20 overflow-hidden">
                          {reservation.Symptoms.slice(0, 2).map(
                            (symptom, index) => (
                              <div
                                key={index}
                                className="flex items-start mb-1"
                              >
                                <AlertCircle className="mr-1 h-3 w-3 mt-1 flex-shrink-0 text-muted-foreground" />
                                <span className="text-sm">{symptom.name}</span>
                              </div>
                            )
                          )}
                          {reservation.Symptoms.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              + {reservation.Symptoms.length - 2} lainnya
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(reservation.status)}
                      </TableCell>
                      <TableCell>
                        <DialogTrigger>
                          <Badge
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          >
                            <Info className="h-4 w-4" />
                          </Badge>
                        </DialogTrigger>
                      </TableCell>
                    </TableRow>

                    {/* Modal Detail Redesigned */}
                    <DialogContent className="max-w-[95%] sm:max-w-md">
                      <DialogHeader className="pb-4">
                        <DialogTitle className="text-lg sm:text-xl">
                          Detail Reservasi
                        </DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm mt-1">
                          Informasi lengkap reservasi servis kendaraan
                        </DialogDescription>
                      </DialogHeader>

                      {/* ScrollArea untuk tampilan mobile */}
                      <ScrollArea className="max-h-[70vh] sm:max-h-none overflow-y-auto pr-4">
                        <div className="space-y-4 py-2">
                          {/* Tanggal & Waktu */}
                          <div className="flex items-start gap-3">
                            <div className="border border-primary/20 p-2 rounded-md">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm sm:text-base mb-1">
                                Tanggal & Waktu
                              </h4>
                              <div className="text-xs sm:text-sm text-muted-foreground">
                                {formatDate(reservation.date)}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground flex items-center mt-1">
                                <Clock className="mr-1 h-3 w-3" />
                                {reservation.time}
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Jenis Servis */}
                          <div className="flex items-start gap-3">
                            <div className="border border-primary/20 p-2 rounded-md">
                              <Wrench className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm sm:text-base mb-1">
                                Jenis Servis
                              </h4>
                              <div className="mt-1">
                                {getServiceTypeBadge(reservation.serviceType)}
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Kendaraan */}
                          <div className="flex items-start gap-3">
                            <div className="border border-primary/20 p-2 rounded-md">
                              <Car className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm sm:text-base mb-1">
                                Kendaraan
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 mt-1">
                                <div className="text-xs sm:text-sm">
                                  <span className="font-medium text-muted-foreground">
                                    Merek:
                                  </span>{" "}
                                  {reservation.Vehicle.brand}
                                </div>
                                <div className="text-xs sm:text-sm">
                                  <span className="font-medium text-muted-foreground">
                                    Tipe:
                                  </span>{" "}
                                  {reservation.Vehicle.type}
                                </div>
                                <div className="text-xs sm:text-sm">
                                  <span className="font-medium text-muted-foreground">
                                    Tahun:
                                  </span>{" "}
                                  {reservation.Vehicle.productionYear}
                                </div>
                                {reservation.Vehicle.licensePlate && (
                                  <div className="text-xs sm:text-sm">
                                    <span className="font-medium text-muted-foreground">
                                      Plat Nomor:
                                    </span>{" "}
                                    {reservation.Vehicle.licensePlate}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Gejala */}
                          <div className="flex items-start gap-3">
                            <div className="border border-primary/20 p-2 rounded-md flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm sm:text-base mb-1">
                                Gejala
                              </h4>
                              {reservation.Symptoms.length > 0 ? (
                                <ScrollArea className="h-28 pr-4 mt-1">
                                  <div className="space-y-2">
                                    {reservation.Symptoms.map(
                                      (symptom, index) => (
                                        <div
                                          key={index}
                                          className="flex items-start gap-2 pb-1"
                                        >
                                          <span className="text-primary/70">
                                            •
                                          </span>
                                          <span className="text-xs sm:text-sm">
                                            {symptom.name}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </ScrollArea>
                              ) : (
                                <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                  Tidak ada gejala tercatat
                                </div>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Status */}
                          <div className="flex items-start gap-3">
                            <div className="border border-primary/20 p-2 rounded-md">
                              <Info className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm sm:text-base mb-1">
                                Status
                              </h4>
                              <div className="mt-1">
                                {getStatusBadge(reservation.status)}
                              </div>
                            </div>
                          </div>

                          {/* Mechanic */}
                          {reservation.Mechanic && (
                            <>
                              <Separator />
                              <div className="flex items-start gap-3">
                                <div className="border border-primary/20 p-2 rounded-md">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm sm:text-base mb-1">
                                    Mekanik
                                  </h4>
                                  <div className="grid grid-cols-1 gap-y-1 mt-1">
                                    <div className="text-xs sm:text-sm flex items-center">
                                      <span className="font-medium text-muted-foreground w-16">
                                        Nama:
                                      </span>
                                      <span>{reservation.Mechanic.name}</span>
                                    </div>
                                    <div className="text-xs sm:text-sm flex items-center">
                                      <span className="font-medium text-muted-foreground w-16">
                                        Telepon:
                                      </span>
                                      <span>
                                        {reservation.Mechanic.phoneNumber}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* Notes */}
                          {reservation.notes && (
                            <>
                              <Separator />
                              <div className="ml-10 space-y-1">
                                <h4 className="font-medium text-sm sm:text-base">
                                  Catatan
                                </h4>
                                <div className="text-xs sm:text-sm bg-muted/30 p-3 rounded-md mt-1">
                                  {reservation.notes}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryReservationPage;
