import { useState } from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/services/api";

const AddVehicleModal = ({ onVehicleAdded }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    type: "",
    productionYear: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post("/vehicles", formData);
      toast.success("Kendaraan berhasil ditambahkan.");
      setOpen(false);
      setFormData({ brand: "", type: "", productionYear: "" });
      onVehicleAdded(data);
    } catch (error) {
      toast.error(error.response?.data?.error || "Gagal menambahkan kendaraan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Tambah Kendaraan</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Kendaraan</DialogTitle>
          <DialogDescription>
            Masukkan informasi kendaraan yang ingin ditambahkan.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="brand">Merek</Label>
            <Input
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Tipe</Label>
            <Input
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="productionYear">Tahun Produksi</Label>
            <Input
              id="productionYear"
              name="productionYear"
              type="number"
              value={formData.productionYear}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

AddVehicleModal.propTypes = {
  onVehicleAdded: PropTypes.func.isRequired,
};

export default AddVehicleModal;
