/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  CircleCheck,
  CircleX,
  Loader,
  Calendar,
  User,
  Car,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import useReservationUser from "@/hooks/useReservationUser";

const getServiceTypeBadge = (type) => {
  if (type === "major") {
    return (
      <Badge
        variant="info"
        className="rounded-full px-3 py-1 text-sm font-medium"
      >
        Servis Besar
      </Badge>
    );
  } else {
    return (
      <Badge
        variant="purple"
        className="rounded-full px-3 py-1 text-sm font-medium"
      >
        Servis Ringan
      </Badge>
    );
  }
};

const StatusBadge = ({ status }) => {
  const variants = {
    pending: {
      variant: "warning",
      icon: <Loader className="mr-2 h-4 w-4 animate-spin" />,
      text: "Menunggu Konfirmasi",
      message: "* Menunggu konfirmasi dari bengkel",
    },
    confirmed: {
      variant: "success",
      icon: <CircleCheck className="mr-2 h-4 w-4" />,
      text: "Dikonfirmasi",
      message: "* Reservasi telah dikonfirmasi, mohon datang tepat waktu",
    },
    cancelled: {
      variant: "danger",
      icon: <CircleX className="mr-2 h-4 w-4" />,
      text: "Dibatalkan",
      message: null,
    },
  };

  const statusInfo = variants[status];

  return (
    <div className="flex flex-col items-end">
      <Badge
        variant={statusInfo.variant}
        className="w-fit flex items-center px-3 py-1"
      >
        {statusInfo.icon} {statusInfo.text}
      </Badge>
      {statusInfo.message && (
        <span className="text-muted-foreground text-sm mt-2 italic">
          {statusInfo.message}
        </span>
      )}
    </div>
  );
};

const InfoSection = ({ title, icon, children }) => (
  <div className="border rounded-lg p-4 shadow-sm bg-card hover:shadow-md transition-shadow">
    <h3 className="font-semibold text-lg mb-4 flex items-center border-b pb-2 text-primary">
      {icon} <span className="ml-2">{title}</span>
    </h3>
    {children}
  </div>
);

const InfoItem = ({ label, value, span = false }) => (
  <>
    <div className="font-medium text-muted-foreground">{label}</div>
    <div className={span ? "col-span-1" : ""}>{value}</div>
  </>
);

const ReservationPage = () => {
  const navigate = useNavigate();
  const {
    reservation,
    loading,
    fetchReservationData,
    handleCancelReservation,
  } = useReservationUser();

  useEffect(() => {
    fetchReservationData();
  }, [fetchReservationData]);

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6 p-4">
        <div className="bg-muted/30 rounded-full p-6">
          <Calendar className="h-16 w-16 text-primary/60" />
        </div>
        <h2 className="text-2xl font-bold">Belum Ada Reservasi</h2>
        <p className="text-muted-foreground text-lg max-w-md">
          Anda belum melakukan reservasi layanan.
        </p>
        <Button
          size="lg"
          onClick={() => navigate("/reservations/create")}
          className="mt-4 font-medium"
        >
          Reservasi Sekarang &raquo;
        </Button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Detail Reservasi</h1>
          <p className="text-muted-foreground">
            Informasi lengkap tentang reservasi anda
          </p>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="space-y-6">
        {/* Main Card */}
        <Card className="bg-background border-2 border-primary/20 overflow-hidden">
          <div className="bg-primary/5 px-6 py-4 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Reservasi #{reservation.id}
              </h2>
              <p className="text-muted-foreground">
                Dibuat pada{" "}
                {new Date(
                  reservation.createdAt || reservation.date
                ).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center">
              {getServiceTypeBadge(reservation.type)}
            </div>
          </div>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appointment Details */}
              <InfoSection
                title="Jadwal Servis"
                icon={<Calendar className="h-5 w-5" />}
              >
                <div className="grid grid-cols-2 gap-y-3">
                  <InfoItem
                    label="Tanggal"
                    value={formatDate(reservation.date)}
                  />

                  {reservation.time && (
                    <InfoItem
                      label="Waktu"
                      value={formatTime(reservation.time)}
                    />
                  )}

                  <InfoItem
                    label="Mekanik"
                    value={
                      reservation.Mechanic?.name || (
                        <span className="text-muted-foreground italic font-light">
                          Belum ditentukan
                        </span>
                      )
                    }
                  />
                </div>
              </InfoSection>

              {/* Vehicle Information */}
              <InfoSection
                title="Informasi Kendaraan"
                icon={<Car className="h-5 w-5" />}
              >
                {reservation.Vehicle ? (
                  <div className="grid grid-cols-2 gap-y-3">
                    <InfoItem label="Merek" value={reservation.Vehicle.brand} />
                    <InfoItem label="Tipe" value={reservation.Vehicle.type} />
                    <InfoItem
                      label="Tahun Produksi"
                      value={reservation.Vehicle.productionYear}
                    />
                  </div>
                ) : (
                  <p className="text-destructive">
                    Informasi kendaraan tidak tersedia
                  </p>
                )}
              </InfoSection>
            </div>

            <div className="mt-6">
              {/* Symptoms and Description */}
              {(reservation.Symptoms?.length > 0 ||
                reservation.description) && (
                <InfoSection
                  title="Detail Masalah"
                  icon={<Wrench className="h-5 w-5" />}
                >
                  <div className="grid grid-cols-1 gap-y-3">
                    {reservation.Symptoms &&
                      reservation.Symptoms.length > 0 && (
                        <>
                          <div className="font-medium text-muted-foreground">
                            Gejala
                          </div>
                          <ul className="list-disc list-inside mb-3 pl-2">
                            {reservation.Symptoms.map((symptom) => (
                              <li key={symptom.id} className="mb-1">
                                {symptom.name}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}

                    {reservation.description && (
                      <>
                        <div className="font-medium text-muted-foreground">
                          Deskripsi
                        </div>
                        <p className="bg-muted/30 p-3 rounded">
                          {reservation.description}
                        </p>
                      </>
                    )}
                  </div>
                </InfoSection>
              )}
            </div>

            <div className="mt-6">
              {/* Customer Information */}
              <InfoSection
                title="Informasi Pelanggan"
                icon={<User className="h-5 w-5" />}
              >
                {reservation.User ? (
                  <div className="grid grid-cols-2 gap-y-3">
                    <InfoItem label="Nama" value={reservation.User.name} />
                    <InfoItem
                      label="Telepon"
                      value={`+62${reservation.User.phone}`}
                    />
                    <InfoItem
                      label="Alamat"
                      value={reservation.User.address}
                      span={true}
                    />
                  </div>
                ) : (
                  <p className="text-destructive">
                    Informasi pelanggan tidak tersedia
                  </p>
                )}
              </InfoSection>
            </div>
          </CardContent>

          <CardFooter className="px-6 py-4 bg-muted/20 flex justify-end items-center">
            <div className="flex flex-col items-end space-y-1">
              <Button
                variant="destructive"
                disabled={reservation.status !== "pending"}
                onClick={() => handleCancelReservation(reservation.id)}
                className={`font-medium ${
                  reservation.status !== "pending" ? "opacity-50" : ""
                }`}
              >
                Batalkan
              </Button>

              {reservation.status !== "pending" && (
                <span className="text-destructive text-xs">
                  Hubungi kami untuk membatalkan reservasi
                </span>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ReservationPage;
