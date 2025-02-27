import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WrenchIcon } from "lucide-react";

const ServicesCard = () => {
  const services = [
    {
      title: "Servis Rutin",
      description: "Perawatan berkala untuk performa optimal motor Anda",
      color: "blue",
    },
    {
      title: "Ganti Oli",
      description: "Penggantian oli untuk menjaga mesin tetap awet",
      color: "green",
    },
    {
      title: "Tune Up",
      description: "Penyetelan mesin untuk performa maksimal",
      color: "purple",
    },
    {
      title: "Penggantian Sparepart",
      description: "Penggantian komponen dengan suku cadang asli",
      color: "orange",
    },
  ];

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle>Layanan Kami</CardTitle>
        <CardDescription>
          Berbagai layanan perawatan motor yang kami sediakan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div
                className={`bg-${service.color}-100 dark:bg-${service.color}-900 p-2 rounded-full`}
              >
                <WrenchIcon
                  size={20}
                  className={`text-${service.color}-600 dark:text-${service.color}-400`}
                />
              </div>
              <div>
                <h3 className="font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Lihat Semua Layanan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServicesCard;
