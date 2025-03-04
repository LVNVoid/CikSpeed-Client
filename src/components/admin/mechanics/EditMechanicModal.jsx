import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const EditMechanicModal = ({ isOpen, onClose, mechanic, onEdit }) => {
  const [editedMechanic, setEditedMechanic] = useState(
    mechanic || { name: "", phoneNumber: "" }
  );

  useEffect(() => {
    if (mechanic) {
      setEditedMechanic(mechanic);
    }
  }, [mechanic]);

  const handleSave = () => {
    onEdit(editedMechanic);
    onClose();
  };

  if (!isOpen || !mechanic) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Mekanik</h2>
        <div className="mb-4">
          <Label>Nama Mekanik</Label>
          <Input
            type="text"
            value={editedMechanic.name}
            onChange={(e) =>
              setEditedMechanic({ ...editedMechanic, name: e.target.value })
            }
            placeholder="Masukkan nama mekanik"
          />
        </div>
        <div className="mb-4">
          <Label>Nomor Telepon</Label>
          <Input
            type="text"
            value={editedMechanic.phoneNumber}
            onChange={(e) =>
              setEditedMechanic({
                ...editedMechanic,
                phoneNumber: e.target.value,
              })
            }
            placeholder="Masukkan nomor telepon"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={!editedMechanic.name || !editedMechanic.phoneNumber}
          >
            Simpan Perubahan
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditMechanicModal;
