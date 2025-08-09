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
import { Calendar, Clock, Car, AlertCircle } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import ReservationDetailModal from "@/components/customer/modals/ReservationDetailModal";
import ReviewModal from "@/components/customer/modals/ReviewModal";

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
                  <TableRow
                    key={reservation.id}
                    className="cursor-pointer hover:bg-muted/50"
                  >
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
                          {reservation.Vehicle.brand} {reservation.Vehicle.type}{" "}
                          ({reservation.Vehicle.productionYear})
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-h-20 overflow-hidden">
                        {reservation.Symptoms.slice(0, 2).map(
                          (symptom, index) => (
                            <div key={index} className="flex items-start mb-1">
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
                    <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                    <TableCell>
                      <div className="flex  gap-2">
                        <ReservationDetailModal
                          reservation={reservation}
                          formatDate={formatDate}
                          getServiceTypeBadge={getServiceTypeBadge}
                          getStatusBadge={getStatusBadge}
                        />
                        <ReviewModal
                          reservation={reservation}
                          formatDate={formatDate}
                          getServiceTypeBadge={getServiceTypeBadge}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
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
