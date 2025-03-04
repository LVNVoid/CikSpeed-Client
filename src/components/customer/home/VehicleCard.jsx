import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarIcon, Trash } from "lucide-react";
import AddVehicleModal from "@/components/customer/modals/AddVehicleModal";

const VehicleCard = ({ vehicles, onDeleteVehicle, onVehicleAdded }) => {
  return (
    <Card className="md:col-span-1 bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CarIcon size={20} />
          Data Kendaraan
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vehicles.length > 0 ? (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="p-4 border rounded">
                <p className="font-bold">
                  {vehicle.brand} {vehicle.type}
                </p>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Tahun Produksi ({vehicle.productionYear})
                    </span>
                    <span className="font-medium">
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1 w-full sm:w-auto"
                        onClick={() => onDeleteVehicle(vehicle.id)}
                      >
                        <Trash size={16} />
                        Hapus
                      </Button>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <CarIcon size={40} className="mx-auto mb-2" />
            <p className="text-muted-foreground">
              Anda memiliki data kendaraan
            </p>
            <div className="mt-4">
              <AddVehicleModal onVehicleAdded={onVehicleAdded} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleCard;
