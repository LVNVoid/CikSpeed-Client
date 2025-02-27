import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PromoCard = () => {
  const promos = [
    {
      badge: "Terbatas",
      badgeColor: "orange",
      title: "Diskon 20% untuk Servis Rutin",
      description: "Berlaku hingga akhir bulan untuk semua tipe motor",
      buttonText: "Klaim Sekarang",
      buttonColor: "orange",
    },
    {
      badge: "Paket Hemat",
      badgeColor: "green",
      title: "Paket Servis Lengkap",
      description:
        "Servis, ganti oli, dan cek kelistrikan dengan harga spesial",
      buttonText: "Lihat Detail",
      buttonColor: "green",
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-orange-100 dark:border-orange-900/50">
      <CardHeader>
        <CardTitle className="text-orange-700 dark:text-orange-400">
          Promo Spesial
        </CardTitle>
        <CardDescription className="text-orange-600 dark:text-orange-300">
          Dapatkan penawaran terbaik untuk kendaraan Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {promos.map((promo, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50 shadow-sm"
            >
              <Badge
                className={`bg-${promo.badgeColor}-500 dark:bg-${promo.badgeColor}-600 mb-2`}
              >
                {promo.badge}
              </Badge>
              <h3 className="font-bold text-lg">{promo.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {promo.description}
              </p>
              <Button
                className={`mt-4 bg-${promo.buttonColor}-500 hover:bg-${promo.buttonColor}-600 dark:bg-${promo.buttonColor}-600 dark:hover:bg-${promo.buttonColor}-700 w-full`}
              >
                {promo.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromoCard;
