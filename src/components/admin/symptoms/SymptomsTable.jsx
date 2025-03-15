/* eslint-disable react/prop-types */
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Trash2 } from "lucide-react";

export const SymptomsTable = ({
  symptoms,
  loading,
  isAdmin,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Tidak tersedia";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getServiceTypeBadge = (serviceType) => {
    switch (serviceType) {
      case "major":
        return <Badge variant="info">Servis Besar</Badge>;
      case "regular":
        return <Badge variant="purple">Servis Ringan</Badge>;
      default:
        return <Badge variant="gray">Tidak diketahui</Badge>;
    }
  };

  return (
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
                {isAdmin && <TableHead className="text-right">Aksi</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 4 : 3}
                    className="text-center py-8"
                  >
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                    <p className="mt-2">Memuat data gejala...</p>
                  </TableCell>
                </TableRow>
              ) : symptoms.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 4 : 3}
                    className="text-center py-8"
                  >
                    Tidak ada gejala yang ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                symptoms.map((symptom) => (
                  <TableRow key={symptom.id}>
                    <TableCell>{symptom.name}</TableCell>
                    <TableCell>
                      {getServiceTypeBadge(symptom.serviceType)}
                    </TableCell>
                    <TableCell>{formatDate(symptom.createdAt)}</TableCell>
                    {isAdmin && (
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              ⋮
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => onEdit(symptom)}>
                              <Edit className="mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => onDelete(symptom.id)}
                            >
                              <Trash2 className="mr-2" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
