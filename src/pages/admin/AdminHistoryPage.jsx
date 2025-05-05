/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { RefreshCcw, Eye, AlertCircleIcon, FilterIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const itemsPerPage = 6;

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

  // Format date in Indonesian locale
  const formatDate = (dateString) => {
    return format(parseISO(dateString), "EEEE, d MMMM yyyy", { locale: id });
  };

  // Translate reservation status
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

  // Reservation Details Drawer
  const ReservationDetailsDrawer = ({ reservation, onClose }) => (
    <Drawer open={!!reservation} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Detail Reservasi #{reservation?.id}</DrawerTitle>
          <DrawerDescription>
            Informasi lengkap tentang reservasi yang dipilih
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Kendaraan</h4>
              <p>
                {reservation?.Vehicle?.brand} {reservation?.Vehicle?.type}
              </p>
              <p className="text-muted-foreground">
                Tahun: {reservation?.Vehicle?.productionYear}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Waktu Reservasi</h4>
              <p>{formatDate(reservation?.date)}</p>
              <p>{reservation?.time.substring(0, 5)}</p>
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-2">Gejala</h4>
            {reservation?.Symptoms && reservation.Symptoms.length > 0 ? (
              <ul className="text-sm text-muted-foreground list-disc pl-4">
                {reservation.Symptoms.map((symptom) => (
                  <li key={symptom.id}>{symptom.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                Tidak ada gejala tercatat
              </p>
            )}
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium">Mekanik</h4>
              <p>{reservation?.Mechanic?.name || "Tidak tersedia"}</p>
              <p>+62{reservation?.Mechanic?.phoneNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Status</h4>
              <Badge
                variant={
                  reservation?.status.toLowerCase() === "success"
                    ? "success"
                    : "destructive"
                }
              >
                {translateStatus(reservation?.status)}
              </Badge>
            </div>
          </div>
          {reservation?.description && (
            <div>
              <h4 className="text-sm font-medium mb-2">Catatan</h4>
              <p className="text-muted-foreground">{reservation.description}</p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );

  // Filter Drawer for Mobile
  const FilterDrawer = () => (
    <Drawer open={isFilterDrawerOpen} onOpenChange={setIsFilterDrawerOpen}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Filter Reservasi</DrawerTitle>
          <DrawerDescription>
            Cari dan filter riwayat reservasi
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setIsFilterDrawerOpen(false);
            }}
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
          <Input
            placeholder="Cari kendaraan, mekanik, atau jenis servis"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-6"
      >
        <h1 className="text-2xl md:text-3xl font-bold">Riwayat Reservasi</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsFilterDrawerOpen(true)}
          >
            <FilterIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReservationHistory}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            <span className="hidden md:inline">Refresh Data</span>
          </Button>
        </div>
      </motion.div>

      {/* Desktop Filter */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="hidden md:block mb-6"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="w-1/3">
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
              <div className="w-2/3">
                <Input
                  placeholder="Cari kendaraan, mekanik, atau jenis servis"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div> */}

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Reservation List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Reservasi</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 animate-pulse bg-gray-50"
                    >
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada reservasi yang sesuai
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedReservations.map((reservation) => (
                  <Card
                    key={reservation.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            #{reservation.id}
                          </h3>
                          <Badge
                            variant={
                              reservation.status.toLowerCase() === "success"
                                ? "success"
                                : "destructive"
                            }
                            className="mr-2"
                          >
                            {translateStatus(reservation.status)}
                          </Badge>
                          <Badge
                            variant={getServiceTypeBadgeVariant(
                              reservation.serviceType
                            )}
                            className="rounded-full"
                          >
                            {getTranslatedServiceType(reservation.serviceType)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <div>{formatDate(reservation.date)}</div>
                          <div>{reservation.time.substring(0, 5)}</div>
                        </div>
                      </div>

                      <Separator className="mb-3" />

                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Kendaraan</h4>
                        <p>
                          {reservation.Vehicle?.brand}{" "}
                          {reservation.Vehicle?.type}
                          <span className="text-muted-foreground text-sm ml-2">
                            ({reservation.Vehicle?.productionYear})
                          </span>
                        </p>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Mekanik</h4>
                        <p className="text-muted-foreground">
                          {reservation.Mechanic?.name || "Tidak tersedia"}
                        </p>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
                  Sebelumnya
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
                  Selanjutnya
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Filter Drawer for Mobile */}
      <FilterDrawer />

      {/* Reservation Details Drawer */}
      {selectedReservation && (
        <ReservationDetailsDrawer
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
};

export default ReservationHistoryPage;
