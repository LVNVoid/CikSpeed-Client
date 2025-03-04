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
import {
  AlertCircle,
  Filter,
  PlusCircle,
  RefreshCcw,
  Search,
  Trash2,
  Edit,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import api from "@/services/api";

const AdminSymptomPage = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterServiceType, setFilterServiceType] = useState("all");

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSymptom, setCurrentSymptom] = useState(null);

  // New symptom form state
  const [newSymptomName, setNewSymptomName] = useState("");
  const [newSymptomServiceType, setNewSymptomServiceType] = useState("regular");

  const fetchSymptoms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/symptoms");
      setSymptoms(response.data);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat mengambil data gejala"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddSymptom = async () => {
    try {
      const response = await api.post("/symptoms", {
        name: newSymptomName,
        serviceType: newSymptomServiceType,
      });

      // Add new symptom to list
      setSymptoms([...symptoms, response.data]);

      // Reset form
      setNewSymptomName("");
      setAddModalOpen(false);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "Terjadi kesalahan saat menambahkan gejala"
      );
    }
  };

  const handleEditSymptom = async () => {
    try {
      const response = await api.put(`/symptoms/${currentSymptom.id}`, {
        name: currentSymptom.name,
        serviceType: currentSymptom.serviceType,
      });

      // Update symptoms list
      setSymptoms(
        symptoms.map((symptom) =>
          symptom.id === currentSymptom.id ? response.data : symptom
        )
      );

      // Reset edit state
      setCurrentSymptom(null);
      setEditModalOpen(false);
    } catch (error) {
      setError(
        error.response?.data?.error || "Terjadi kesalahan saat mengubah gejala"
      );
    }
  };

  const handleDeleteSymptom = async (id) => {
    try {
      await api.delete(`/symptoms/${id}`);

      // Remove symptom from list
      setSymptoms(symptoms.filter((symptom) => symptom.id !== id));
    } catch (error) {
      setError(
        error.response?.data?.error || "Terjadi kesalahan saat menghapus gejala"
      );
    }
  };

  useEffect(() => {
    fetchSymptoms();
  }, []);

  const filteredSymptoms = symptoms.filter((symptom) => {
    const matchesSearch = symptom.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesServiceType =
      filterServiceType === "all" || symptom.serviceType === filterServiceType;

    return matchesSearch && matchesServiceType;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Tidak tersedia";

    try {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleDateString("id-ID", options);
    } catch (error) {
      return "Format tanggal tidak valid";
    }
  };

  const getServiceTypeBadge = (serviceType) => {
    switch (serviceType) {
      case "major":
        return (
          <Badge variant="info" className="rounded-full">
            Servis Besar
          </Badge>
        );
      case "regular":
        return (
          <Badge variant="purple" className="rounded-full">
            Servis Ringan
          </Badge>
        );
      default: {
        return (
          <Badge variant="gray" className="rounded-full">
            Tidak diketahui
          </Badge>
        );
      }
    }
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
          <h1 className="text-3xl font-bold tracking-tight">
            Manajemen Gejala
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola daftar gejala untuk layanan servis
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSymptoms}
            disabled={loading}
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
          <Button size="sm" onClick={() => setAddModalOpen(true)}>
            <PlusCircle className="w-4 h-4 mr-2" />
            Tambah Gejala
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Gejala</CardTitle>
          <CardDescription>Cari dan filter daftar gejala</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari berdasarkan nama gejala..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Select
                value={filterServiceType}
                onValueChange={setFilterServiceType}
              >
                <SelectTrigger className="px-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis Servis</SelectItem>
                  <SelectItem value="regular">Servis Ringan</SelectItem>
                  <SelectItem value="major">Servis Besar</SelectItem>
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
          <CardTitle>Daftar Gejala</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Gejala</TableHead>
                  <TableHead>Jenis Servis</TableHead>
                  <TableHead>Dibuat pada</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                      </div>
                      <p className="mt-2 text-foreground">
                        Memuat data gejala...
                      </p>
                    </TableCell>
                  </TableRow>
                ) : filteredSymptoms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <p className="text-foreground">
                        Tidak ada gejala yang ditemukan
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSymptoms.map((symptom) => (
                    <TableRow key={symptom.id} className="hover:bg-muted/50">
                      <TableCell>
                        <p className="font-medium">{symptom.name}</p>
                      </TableCell>
                      <TableCell>
                        {getServiceTypeBadge(symptom.serviceType)}
                      </TableCell>
                      <TableCell>
                        <p>{formatDate(symptom.createdAt)}</p>
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
                            <DropdownMenuItem
                              onClick={() => {
                                setCurrentSymptom(symptom);
                                setEditModalOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteSymptom(symptom.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
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
        </CardContent>
      </Card>

      {/* Add Symptom Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Gejala Baru</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Gejala</Label>
              <Input
                value={newSymptomName}
                onChange={(e) => setNewSymptomName(e.target.value)}
                placeholder="Masukkan nama gejala"
              />
            </div>
            <div>
              <Label>Jenis Servis</Label>
              <Select
                value={newSymptomServiceType}
                onValueChange={setNewSymptomServiceType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis servis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Servis Ringan</SelectItem>
                  <SelectItem value="major">Servis Besar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddModalOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAddSymptom} disabled={!newSymptomName}>
                Tambah
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Symptom Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gejala</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nama Gejala</Label>
              <Input
                value={currentSymptom?.name || ""}
                onChange={(e) =>
                  setCurrentSymptom({
                    ...currentSymptom,
                    name: e.target.value,
                  })
                }
                placeholder="Masukkan nama gejala"
              />
            </div>
            <div>
              <Label>Jenis Servis</Label>
              <Select
                value={currentSymptom?.serviceType || ""}
                onValueChange={(value) =>
                  setCurrentSymptom({
                    ...currentSymptom,
                    serviceType: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis servis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Servis Ringan</SelectItem>
                  <SelectItem value="major">Servis Besar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                Batal
              </Button>
              <Button
                onClick={handleEditSymptom}
                disabled={!currentSymptom?.name}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminSymptomPage;
