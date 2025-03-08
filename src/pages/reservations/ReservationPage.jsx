import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { CircleCheck, CircleX, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";

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

const ReservationPage = () => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await api.get("/reservations/my-reservations");
        if (response.data) {
          setReservation(response.data.data);
        } else {
          setReservation(null);
        }
      } catch (err) {
        if (err.response && err.response.status !== 404) {
          setError("Gagal mengambil data reservasi");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, []);

  if (loading) {
    return <Skeleton className="w-full h-40" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
        <p className="text-red-600 text-lg">{error}</p>
        <Button onClick={() => navigate("/reservations/create")}>
          Coba Lagi &raquo;
        </Button>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-4">
        <p className="text-muted-foreground text-lg">
          Anda belum melakukan reservasi.
        </p>
        <Button onClick={() => navigate("/reservations/create")}>
          Reservasi Sekarang &raquo;
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-4xl mx-4 bg-background border border-primary/20">
        <CardHeader>
          <CardTitle>Detail Reservasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Detail Reservasi */}
            <div className="border-b pb-4">
              <div className="grid grid-cols-2 gap-y-3">
                <p className="font-medium text-muted-foreground">Tanggal</p>
                <p>
                  {new Date(reservation.date).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p className="font-medium text-muted-foreground">Mekanik</p>
                <p>
                  {reservation.Mechanic?.name || (
                    <span className="text-muted-foreground italic font-light">
                      Belum ditentukan
                    </span>
                  )}
                </p>

                {reservation.time && (
                  <>
                    <p className="font-medium text-muted-foreground">Waktu</p>
                    <p>{formatTime(reservation.time)}</p>
                    <p className="font-medium text-muted-foreground">
                      Jenis Servis
                    </p>
                    <span>{getServiceTypeBadge(reservation.type)}</span>
                  </>
                )}

                <p className="font-medium text-muted-foreground">Status</p>
                <div className="flex flex-col">
                  <span>
                    <Badge
                      variant={
                        reservation.status === "pending"
                          ? "warning"
                          : reservation.status === "confirmed"
                          ? "success"
                          : "danger"
                      }
                    >
                      {reservation.status === "pending" ? (
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                      ) : reservation.status === "confirmed" ? (
                        <CircleCheck className="mr-2 h-4 w-4" />
                      ) : (
                        <CircleX className="mr-2 h-4 w-4" />
                      )}{" "}
                      {reservation.status === "pending"
                        ? "Menunggu Konfirmasi"
                        : reservation.status === "confirmed"
                        ? "Dikonfirmasi"
                        : "Dibatalkan"}
                    </Badge>
                  </span>
                  <span>
                    {reservation.status === "pending" ? (
                      <span className="text-muted-foreground text-sm mt-1 italic">
                        *Menunggu konfirmasi dari mekanik
                      </span>
                    ) : (
                      reservation.status === "confirmed" && (
                        <span className="text-muted-foreground text-sm mt-1 italic">
                          *Reservasi telah dikonfirmasi mohon datang tepat waktu
                        </span>
                      )
                    )}
                  </span>
                </div>

                {reservation.Symptoms && reservation.Symptoms.length > 0 && (
                  <>
                    <p className="font-medium text-muted-foreground">Gejala</p>
                    <ul className="list-disc list-inside">
                      {reservation.Symptoms.map((symptom) => (
                        <li key={symptom.id}>{symptom.name}</li>
                      ))}
                    </ul>
                  </>
                )}
                {reservation.description && (
                  <>
                    <p className="font-medium text-muted-foreground">
                      Deskripsi
                    </p>
                    <p>{reservation.description}</p>
                  </>
                )}
              </div>
            </div>

            {/* Informasi Kendaraan */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-3">
                Informasi Kendaraan
              </h3>
              {reservation.Vehicle ? (
                <div className="grid grid-cols-2 gap-y-3">
                  <p className="font-medium text-muted-foreground">Merek</p>
                  <p>{reservation.Vehicle.brand}</p>
                  <p className="font-medium text-muted-foreground">Tipe</p>
                  <p>{reservation.Vehicle.type}</p>
                  <p className="font-medium text-muted-foreground">
                    Tahun Produksi
                  </p>
                  <p>{reservation.Vehicle.productionYear}</p>
                </div>
              ) : (
                <p className="text-destructive">
                  Informasi kendaraan tidak tersedia
                </p>
              )}
            </div>

            {/* Informasi Pelanggan */}
            <div>
              <h3 className="font-semibold text-lg mb-3">
                Informasi Pelanggan
              </h3>
              {reservation.User ? (
                <div className="grid grid-cols-2 gap-y-3">
                  <p className="font-medium text-muted-foreground">Nama</p>
                  <p>{reservation.User.name}</p>
                  <p className="font-medium text-muted-foreground">Telepon</p>
                  <p>{reservation.User.phone}</p>
                  <p className="font-medium text-muted-foreground">Alamat</p>
                  <p>{reservation.User.address}</p>
                </div>
              ) : (
                <p className="text-destructive">
                  Informasi pelanggan tidak tersedia
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationPage;
