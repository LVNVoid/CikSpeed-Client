import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const AddMechanicModal = ({ isOpen, onClose, onAdd }) => {
  const [mechanicName, setMechanicName] = useState("");
  const [mechanicPhone, setMechanicPhone] = useState("");

  const handleAdd = () => {
    onAdd({ name: mechanicName, phoneNumber: mechanicPhone });
    setMechanicName("");
    setMechanicPhone("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Tambah Mekanik Baru</h2>
        <div className="mb-4">
          <Label>Nama Mekanik</Label>
          <Input
            type="text"
            value={mechanicName}
            onChange={(e) => setMechanicName(e.target.value)}
            placeholder="Masukkan nama mekanik"
          />
        </div>
        <div className="mb-4">
          <Label>Nomor Telepon</Label>
          <Input
            type="text"
            value={mechanicPhone}
            onChange={(e) => setMechanicPhone(e.target.value)}
            placeholder="Masukkan nomor telepon"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!mechanicName || !mechanicPhone}
          >
            Tambah
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddMechanicModal;
