/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CarIcon, Trash } from "lucide-react";
import AddVehicleModal from "@/components/customer/modals/AddVehicleModal";
import { useState } from "react";

const VehicleCard = ({ vehicles, onDeleteVehicle, onVehicleAdded }) => {
  // Track if all vehicles are being shown
  const [showAllVehicles, setShowAllVehicles] = useState(false);

  // Determine if we should show the add button (less than 3 vehicles)
  const showAddButton = vehicles.length < 3;

  // Get only the first 3 vehicles or all if showAllVehicles is true
  const displayedVehicles = showAllVehicles ? vehicles : vehicles.slice(0, 3);

  return (
    <Card className="md:col-span-1 bg-background">
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <CarIcon size={20} />
            Data Kendaraan
          </div>
          {showAddButton && (
            <div>
              <AddVehicleModal onVehicleAdded={onVehicleAdded} />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vehicles.length > 0 ? (
          <div className="space-y-4">
            {displayedVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="p-3 sm:p-4 border rounded flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="font-bold">
                    {vehicle.brand} {vehicle.type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Tahun Produksi ({vehicle.productionYear})
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex items-center gap-1 mt-2 sm:mt-0"
                  onClick={() => onDeleteVehicle(vehicle.id)}
                >
                  <Trash size={16} />
                  <span className="sm:inline">Hapus</span>
                </Button>
              </div>
            ))}

            {/* Show "View more" button if there are more than 3 vehicles */}
            {vehicles.length > 3 && !showAllVehicles && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAllVehicles(true)}
              >
                Lihat Semua ({vehicles.length})
              </Button>
            )}

            {/* Show "View less" button if showing all vehicles */}
            {showAllVehicles && vehicles.length > 3 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAllVehicles(false)}
              >
                Tampilkan Lebih Sedikit
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col text-center py-6">
            <CarIcon size={40} className="mx-auto mb-2" />
            <p className="text-muted-foreground">
              Anda belum memiliki data kendaraan
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
