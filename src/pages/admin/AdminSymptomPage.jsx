import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  Filter,
  PlusCircle,
  RefreshCcw,
  Search,
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

import { useAuth } from "@/contexts/AuthContext";
import { useSymptoms } from "@/hooks/useSymptoms";
import { SymptomsTable } from "@/components/admin/symptoms/SymptomsTable";
import { AddSymptomModal } from "@/components/admin/symptoms/AddSymptompsModal";
import { EditSymptomModal } from "@/components/admin/symptoms/EditSymptomModal";

const AdminSymptomPage = () => {
  const {
    filteredSymptoms,
    loading,
    error,
    searchQuery,
    filterServiceType,
    addModalOpen,
    editModalOpen,
    currentSymptom,
    newSymptomName,
    newSymptomServiceType,
    setSearchQuery,
    setFilterServiceType,
    setAddModalOpen,
    setEditModalOpen,
    setCurrentSymptom,
    setNewSymptomName,
    setNewSymptomServiceType,
    fetchSymptoms,
    addSymptom,
    editSymptom,
    deleteSymptom,
  } = useSymptoms();

  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

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
            Manajemen Gejala Kerusakan
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola daftar gejala kerusakan untuk layanan servis
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
          {isAdmin && (
            <Button size="sm" onClick={() => setAddModalOpen(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Tambah Gejala Kerusakan
            </Button>
          )}
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Gejala Kerusakan</CardTitle>
          <CardDescription>
            Cari dan filter daftar gejala kerusakan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Cari berdasarkan nama gejala kerusakan..."
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

      <SymptomsTable
        symptoms={filteredSymptoms}
        loading={loading}
        isAdmin={isAdmin}
        onEdit={(symptom) => {
          setCurrentSymptom(symptom);
          setEditModalOpen(true);
        }}
        onDelete={deleteSymptom}
      />

      <AddSymptomModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        name={newSymptomName}
        onNameChange={(e) => setNewSymptomName(e.target.value)}
        serviceType={newSymptomServiceType}
        onServiceTypeChange={setNewSymptomServiceType}
        onSubmit={addSymptom}
      />

      <EditSymptomModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        symptom={currentSymptom}
        onSymptomChange={setCurrentSymptom}
        onSave={editSymptom}
      />
    </motion.div>
  );
};

export default AdminSymptomPage;
