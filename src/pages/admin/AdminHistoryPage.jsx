import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar, AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/services/api";
import {
  getServiceTypeBadgeVariant,
  getTranslatedServiceType,
} from "@/lib/utils";

const ReservationHistoryPage = () => {
  // State management
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch reservation history data from API
  const fetchReservationHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get("/reservations/history");
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservation history:", error);
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat mengambil data riwayat reservasi"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchReservationHistory();
  }, []);

  // Filter reservations based on status and search query
  const filteredReservations = reservations.filter((reservation) => {
    const matchesStatus =
      statusFilter === "all" ||
      reservation.status.toLowerCase() === statusFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      reservation.Vehicle?.brand?.toLowerCase().includes(searchLower) ||
      reservation.Vehicle?.type?.toLowerCase().includes(searchLower) ||
      reservation.Mechanic?.name?.toLowerCase().includes(searchLower) ||
      reservation.serviceType?.toLowerCase().includes(searchLower) ||
      (reservation.Symptoms &&
        reservation.Symptoms.some((symptom) =>
          symptom.name.toLowerCase().includes(searchLower)
        ));

    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const translateStatus = (status) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "success":
        return "Selesai";
      case "failed":
        return "Gagal";
      default:
        return status;
    }
  };

  // Skeleton loader for cards
  const ReservationSkeleton = () => (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-24" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Separator className="my-3" />
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-44" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Skeleton className="h-9 w-20" />
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Riwayat Reservasi</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReservationHistory}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, index) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </CardContent>
                </Card>
              ))
          : Object.entries(statistics).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {key === "totalReservations"
                        ? "Total Reservasi"
                        : key === "successReservations"
                        ? "Reservasi Selesai"
                        : "Reservasi Gagal"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {value.toLocaleString()}
                    </div>
                    {key !== "totalReservations" &&
                      statistics.totalReservations > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {Math.round(
                            (value / statistics.totalReservations) * 100
                          )}
                          % dari total reservasi
                        </p>
                      )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div> */}

      {/* Filter and Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Filter Reservasi</CardTitle>
            <CardDescription>Cari dan filter riwayat reservasi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="success">Selesai</SelectItem>
                    <SelectItem value="failed">Gagal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-2/3">
                <Input
                  placeholder="Cari berdasarkan kendaraan, mekanik, atau jenis servis"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Reservation Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="list">Daftar Reservasi</TabsTrigger>
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>
                  Riwayat Reservasi{" "}
                  {!loading && `(${filteredReservations.length})`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            <div className="w-full md:w-2 h-2 md:h-auto bg-gray-200"></div>
                            <div className="flex-1 p-4">
                              <ReservationSkeleton />
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                ) : filteredReservations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Tidak ada reservasi yang sesuai dengan filter
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedReservations.map((reservation, index) => (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Card className="overflow-hidden">
                          <div className="flex flex-col md:flex-row">
                            {/* Status indicator - left colored bar */}
                            <div
                              className={`w-full md:w-2 h-2 md:h-auto ${
                                reservation.status.toLowerCase() === "success"
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                            ></div>

                            <div className="flex-1 p-4">
                              <div className="flex flex-col md:flex-row justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-semibold">
                                      #{reservation.id}
                                    </h3>
                                    <Badge variant="success">
                                      {translateStatus(reservation.status)}
                                    </Badge>
                                    <Badge
                                      variant={getServiceTypeBadgeVariant(
                                        reservation.serviceType
                                      )}
                                      className={"rounded-full"}
                                    >
                                      {getTranslatedServiceType(
                                        reservation.serviceType
                                      )}
                                    </Badge>
                                  </div>

                                  <div className="mb-2">
                                    <span className="font-medium">
                                      {reservation.Vehicle?.brand}{" "}
                                      {reservation.Vehicle?.type}
                                    </span>
                                    <span className="text-muted-foreground text-sm ml-2">
                                      ({reservation.Vehicle?.productionYear})
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2 md:mt-0">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(reservation.date)}</span>
                                  <span>
                                    {reservation.time.substring(0, 5)}
                                  </span>
                                </div>
                              </div>

                              <Separator className="my-3" />

                              <div className="mt-2">
                                <div className="flex flex-col md:flex-row justify-between">
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">
                                      Gejala:
                                    </h4>
                                    {reservation.Symptoms &&
                                    reservation.Symptoms.length > 0 ? (
                                      <ul className="text-sm text-muted-foreground">
                                        {reservation.Symptoms.map((symptom) => (
                                          <li key={symptom.id}>
                                            • {symptom.name}
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p className="text-sm text-muted-foreground">
                                        Tidak ada gejala tercatat
                                      </p>
                                    )}
                                  </div>

                                  <div className="mt-3 md:mt-0">
                                    <h4 className="text-sm font-medium mb-1">
                                      Mekanik:
                                    </h4>
                                    <div className="text-sm text-muted-foreground">
                                      <p>
                                        {reservation.Mechanic?.name ||
                                          "Tidak tersedia"}
                                      </p>
                                      <p>
                                        {reservation.Mechanic?.phoneNumber ||
                                          "Tidak tersedia"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {reservation.description && (
                                <div className="mt-3 text-sm">
                                  <h4 className="font-medium mb-1">Catatan:</h4>
                                  <p className="text-muted-foreground">
                                    {reservation.description}
                                  </p>
                                </div>
                              )}

                              <div className="mt-4 flex justify-end gap-2">
                                <Button variant="outline" size="sm">
                                  Detail
                                </Button>
                                {reservation.status.toLowerCase() ===
                                  "success" && (
                                  <Button variant="secondary" size="sm">
                                    Buat Ulang
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {!loading && filteredReservations.length > 0 && (
                  <div className="mt-6 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                    >
                      Previous
                    </Button>

                    <div className="flex items-center mx-2">
                      <span className="text-sm">
                        Halaman {currentPage} dari {totalPages || 1}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Kalender Reservasi</CardTitle>
                <CardDescription>
                  Tampilan kalender untuk melihat jadwal reservasi
                </CardDescription>
              </CardHeader>
              <CardContent className="h-96 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                  <p>Tampilan kalender akan ditampilkan di sini</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Lihat riwayat reservasi dalam tampilan kalender
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ReservationHistoryPage;
