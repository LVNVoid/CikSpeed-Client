import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Filter, RefreshCcw, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import api from "@/services/api";
import {
  capitalizeFirstLetter,
  getStatusBadgeVariant,
  getTranslatedStatus,
} from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const AdminReservationPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredReservations = reservations.filter((reservation) => {
    // Filter by search query
    const matchesSearch =
      reservation.User.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reservation.User.phone.includes(searchQuery) ||
      reservation.serviceType.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      filterStatus === "all" || reservation.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const fetchReservation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/reservations");
      setReservations(response.data);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat mengambil data riwayat reservasi"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservation();
  }, []);

  const handleConfirm = (id) => {
    console.log(`Confirmed reservation with id: ${id}`);
  };

  const getServiceTypeBadge = (serviceType) => {
    switch (serviceType) {
      case "major":
        return (
          <Badge variant="info" className={"rounded-full"}>
            Servis Besar
          </Badge>
        );
      case "regular":
        return (
          <Badge variant="purple" className={"rounded-full"}>
            Servis Ringan
          </Badge>
        );
      default:
        return (
          <Badge variant="default" className={"rounded-full"}>
            {serviceType}
          </Badge>
        );
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto py-8 px-4 md:px-6"
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl text-foreground font-bold tracking-tight">
            Manajemen Reservasi
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola semua permintaan reservasi pelanggan
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchReservation}
          disabled={loading}
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Reservasi</CardTitle>
          <CardDescription>Cari dan filter riwayat reservasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari berdasarkan nama, telepon, atau jenis servis..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="px-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="success">Dikonfirmasi</SelectItem>
                  <SelectItem value="pending">Menunggu Konfirmasi</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Daftar Reservasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto p-2">
            <Table>
              <TableHeader className="bg-background">
                <TableRow>
                  <TableHead className="font-semibold">Pelanggan</TableHead>
                  <TableHead className="font-semibold">
                    Tanggal & Waktu
                  </TableHead>
                  <TableHead className="font-semibold">Jenis Servis</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                      <p className="mt-2 text-foreground">
                        Memuat data reservasi...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : filteredReservations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-foreground">
                        Tidak ada reservasi yang ditemukan
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id} className="hover:bg-muted">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {reservation.User.name
                                .substring(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {reservation.User.name}
                            </p>
                            <p className="text-sm text-foreground">
                              {reservation.User.phone}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {formatDate(reservation.date)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getServiceTypeBadge(reservation.serviceType)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusBadgeVariant(reservation.status)}
                        >
                          {capitalizeFirstLetter(
                            getTranslatedStatus(reservation.status)
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Buka menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleConfirm(reservation.id)}
                            >
                              Konfirmasi
                            </DropdownMenuItem>
                            <DropdownMenuItem>Ubah Status</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Batalkan
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination
          {filteredReservations.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-foreground">
                Menampilkan {filteredReservations.length} dari{" "}
                {reservations.length} reservasi
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled>
                  Sebelumnya
                </Button>
                <Button variant="outline" size="sm" className="bg-blue-50">
                  1
                </Button>
                <Button variant="outline" size="sm">
                  2
                </Button>
                <Button variant="outline" size="sm">
                  3
                </Button>
                <Button variant="outline" size="sm">
                  Selanjutnya
                </Button>
              </div>
            </div>
          )} */}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminReservationPage;
