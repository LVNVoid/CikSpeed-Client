import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  WrenchIcon,
  CalendarIcon,
  ClockIcon,
  Loader,
  CircleCheck,
  CircleX,
  Loader2,
} from "lucide-react";
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

const ReservationCard = ({ reservation, onCancelReservation }) => {
  const navigate = useNavigate();

  return (
    <Card className="md:col-span-1 bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WrenchIcon size={20} /> Reservasi Aktif
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reservation ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">
                {getServiceTypeBadge(reservation.serviceType)}
              </h3>
              <Badge
                variant={
                  reservation.status === "pending"
                    ? "warning"
                    : reservation.status === "confirmed"
                    ? "success"
                    : "info"
                }
              >
                {reservation.status === "pending" ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : reservation.status === "confirmed" ? (
                  <CircleCheck className="mr-2 h-4 w-4" />
                ) : (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}{" "}
                {reservation.status === "pending"
                  ? "Menunggu Konfirmasi"
                  : reservation.status === "confirmed"
                  ? "Dikonfirmasi"
                  : "Sedang Dikerjakan"}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <CalendarIcon
                size={16}
                className="text-gray-500 dark:text-gray-400"
              />
              <span>
                {new Date(reservation.date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {reservation.time && (
              <div className="flex items-center gap-2">
                <ClockIcon
                  size={16}
                  className="text-gray-500 dark:text-gray-400"
                />
                <span>{formatTime(reservation.time)}</span>
              </div>
            )}

            {reservation.Vehicle ? (
              <div className="p-3 bg-background border rounded mt-4">
                <h4 className="font-medium text-sm">Kendaraan:</h4>
                <p>
                  {reservation.Vehicle.brand} {reservation.Vehicle.type} (
                  {reservation.Vehicle.productionYear})
                </p>
              </div>
            ) : (
              <div className="p-3 bg-background border rounded mt-4">
                <h4 className="font-medium text-sm">Kendaraan:</h4>
                <p>Data kendaraan tidak tersedia</p>
              </div>
            )}

            {reservation.Symptoms && reservation.Symptoms.length > 0 ? (
              <div className="p-3 bg-background border rounded">
                <h4 className="font-medium text-sm">Gejala:</h4>
                <ul className="text-sm list-disc list-inside">
                  {reservation.Symptoms.map((symptom) => (
                    <li key={symptom.id}>{symptom.name}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-center py-8">
            <WrenchIcon
              size={48}
              className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
            />
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Anda belum melakukan reservasi
            </p>
            <Button variant="outline" className="w-full">
              <Link to="/reservations/create">Reservasi Sekarang &raquo; </Link>
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {reservation && (
          <>
            <Button
              variant="outline"
              onClick={() => navigate("/reservations")} // Tambahkan navigasi
            >
              Detail Reservasi &raquo;
            </Button>
            <Button
              variant="destructive"
              disabled={reservation.status !== "pending"}
              onClick={() => onCancelReservation(reservation.id)}
            >
              Batalkan
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

ReservationCard.propTypes = {
  reservation: PropTypes.shape({
    id: PropTypes.number,
    serviceType: PropTypes.string,
    status: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    Vehicle: PropTypes.shape({
      brand: PropTypes.string,
      type: PropTypes.string,
      productionYear: PropTypes.number,
    }),
    Symptoms: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
      })
    ),
  }),
  onCancelReservation: PropTypes.func.isRequired,
};

export default ReservationCard;
