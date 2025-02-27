import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader } from "lucide-react";
import api from "@/services/api";

const HistoryReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoryReservations = async () => {
      try {
        const response = await api.get("/reservations/history");
        setReservations(response.data);
      } catch (error) {
        console.error("Gagal mengambil data riwayat reservasi", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryReservations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-6">
      {reservations.length === 0 ? (
        <p className="text-gray-500">Tidak ada riwayat reservasi.</p>
      ) : (
        <Card className="p-4 shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Tanggal & Waktu</TableHead>
                <TableHead>Jenis Servis</TableHead>
                <TableHead>Kendaraan</TableHead>
                <TableHead>Gejala</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell>
                    {new Date(reservation.date).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    - {reservation.time}
                  </TableCell>
                  <TableCell>
                    {reservation.serviceType === "major"
                      ? "Servis Besar"
                      : "Servis Ringan"}
                  </TableCell>
                  <TableCell>
                    {reservation.Vehicle.brand} {reservation.Vehicle.type} (
                    {reservation.Vehicle.productionYear})
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc ml-4">
                      {reservation.Symptoms.map((symptom) => (
                        <li key={symptom.id}>{symptom.name}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        reservation.status === "success" ? "success" : "danger"
                      }
                    >
                      {reservation.status === "success" ? "Berhasil" : "Gagal"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default HistoryReservationPage;
