import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const StatsCard = () => {
  const stats = [
    {
      value: "98%",
      label: "Kepuasan Pelanggan",
    },
    {
      value: "15+",
      label: "Tahun Pengalaman",
    },
    {
      value: "24",
      label: "Jam Layanan",
    },
    {
      value: "10K+",
      label: "Motor Terservis",
    },
  ];

  return (
    <Card className="border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle>Mengapa Memilih Kami?</CardTitle>
        <CardDescription>
          Kami berkomitmen memberikan layanan terbaik untuk kendaraan Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg dark:bg-gray-800/50"
            >
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {stat.value}
              </div>
              <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
