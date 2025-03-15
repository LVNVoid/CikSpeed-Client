/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const AddSymptomModal = ({
  open,
  onOpenChange,
  name,
  onNameChange,
  serviceType,
  onServiceTypeChange,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Gejala Baru</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nama Gejala</Label>
            <Input
              value={name}
              onChange={onNameChange}
              placeholder="Masukkan nama gejala"
            />
          </div>
          <div>
            <Label>Jenis Servis</Label>
            <Select value={serviceType} onValueChange={onServiceTypeChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button onClick={onSubmit} disabled={!name}>
              Tambah
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
