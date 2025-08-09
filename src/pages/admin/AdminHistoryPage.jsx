/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
  RefreshCcw,
  Eye,
  AlertCircleIcon,
  FilterIcon,
  Star,
  MessageSquare,
  Calendar,
  User,
  Car,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const itemsPerPage = 8;

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

  // Fetch review data from API
  const fetchReview = async (reservationId) => {
    setReviewLoading(true);
    setReviewError(null);
    setSelectedReview(null);

    try {
      const response = await api.get(`/reviews/${reservationId}`);
      setSelectedReview(response.data);
    } catch (error) {
      console.error("Error fetching review:", error);
      setReviewError(
        error.response?.data?.error || error.response?.status === 404
          ? "Review tidak ditemukan untuk reservasi ini"
          : "Terjadi kesalahan saat mengambil data review"
      );
    } finally {
      setReviewLoading(false);
    }
  };

  // Handle review modal open
  const handleViewReview = (reservationId) => {
    setIsReviewModalOpen(true);
    fetchReview(reservationId);
  };

  // Handle review modal close
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedReview(null);
    setReviewError(null);
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

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  // Review Modal Component
  const ReviewModal = () => (
    <Dialog open={isReviewModalOpen} onOpenChange={handleCloseReviewModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Pelanggan</DialogTitle>
          <DialogDescription>
            Review yang diberikan untuk reservasi ini
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {reviewLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Memuat review...</span>
            </div>
          ) : reviewError ? (
            <Alert variant="destructive">
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{reviewError}</AlertDescription>
            </Alert>
          ) : selectedReview ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex">{renderStars(selectedReview.rating)}</div>
                <span className="text-sm font-medium">
                  {selectedReview.rating}/5
                </span>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Komentar:</h4>
                <p className="text-sm text-muted-foreground bg-background p-3 rounded-md">
                  {selectedReview.comment || "Tidak ada komentar"}
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                Ditulis pada:{" "}
                {format(
                  parseISO(selectedReview.createdAt),
                  "dd MMMM yyyy, HH:mm",
                  { locale: id }
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-background p-4 mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Belum Ada Review
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Review belum tersedia untuk reservasi ini. Review akan muncul
                setelah pelanggan memberikan penilaian.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

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
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <h4 className="text-sm font-medium">Detail Servis</h4>
              <p>{reservation?.serviceDetail}</p>
            </div>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
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
      </motion.div>

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
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Riwayat Reservasi</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 animate-pulse"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/3 mb-3"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                        </div>
                        <div className="h-8 bg-gray-200 rounded w-20"></div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : filteredReservations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Tidak ada reservasi yang sesuai
              </div>
            ) : (
              <div className="space-y-3">
                {paginatedReservations.map((reservation, index) => (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Left side - Main info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            #{reservation.id}
                          </h3>
                          <Badge
                            variant={
                              reservation.status.toLowerCase() === "success"
                                ? "success"
                                : "destructive"
                            }
                          >
                            {translateStatus(reservation.status)}
                          </Badge>
                          <Badge
                            variant={getServiceTypeBadgeVariant(
                              reservation.serviceType
                            )}
                          >
                            {getTranslatedServiceType(reservation.serviceType)}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {reservation.Vehicle?.brand}{" "}
                              {reservation.Vehicle?.type}
                              <span className="text-muted-foreground ml-1">
                                ({reservation.Vehicle?.productionYear})
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {reservation.Mechanic?.name || "Tidak tersedia"}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span>
                              {formatDate(reservation.date)} -{" "}
                              {reservation.time.substring(0, 5)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Detail
                        </Button>

                        <Button
                          size="sm"
                          onClick={() => handleViewReview(reservation.id)}
                          disabled={
                            reservation.status.toLowerCase() !== "success"
                          }
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
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

      {/* Review Modal */}
      <ReviewModal />
    </div>
  );
};

export default ReservationHistoryPage;
