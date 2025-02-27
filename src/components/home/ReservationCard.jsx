import { Link } from "react-router-dom";
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
} from "lucide-react";

const ReservationCard = ({ reservation }) => {
  return (
    <Card className="md:col-span-1 border-gray-200 dark:border-gray-700">
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
                {reservation.serviceType === "major"
                  ? "Servis Besar"
                  : "Servis Ringan"}
              </h3>
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
                <span>{reservation.time}</span>
              </div>
            )}

            {reservation.Vehicle ? (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
                <h4 className="font-medium text-sm">Kendaraan:</h4>
                <p>
                  {reservation.Vehicle.brand} {reservation.Vehicle.type} (
                  {reservation.Vehicle.productionYear})
                </p>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
                <h4 className="font-medium text-sm">Kendaraan:</h4>
                <p>Data kendaraan tidak tersedia</p>
              </div>
            )}

            {reservation.Symptoms && reservation.Symptoms.length > 0 ? (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
            <Button className="w-full">
              <Link to="/reservations/create">Reservasi Sekarang</Link>
            </Button>
          </div>
        )}
      </CardContent>
      {reservation && (
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Link to={`/reservation/${reservation.id}`}>Lihat Detail</Link>
          </Button>
          {reservation.status === "pending" && (
            <Button variant="destructive">Batalkan</Button>
          )}
        </CardFooter>
      )}
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
};

export default ReservationCard;
