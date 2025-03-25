import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addDays, format } from "date-fns";
import { id } from "date-fns/locale";
import api from "../../../services/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  CarIcon,
  WrenchIcon,
  ClockIcon,
  AlertCircleIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomCalendar from "@/components/ui/CustomCalendar";
import { toast } from "sonner";

const CreateReservation = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [time, setTime] = useState("");
  const [symptomIds, setSymptomIds] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [userVehicles, setUserVehicles] = useState([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [serviceType, setServiceType] = useState("regular");
  const [isLoading, setIsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isOtherSymptom, setIsOtherSymptom] = useState(false);
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const formattedDate = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [symptomsResponse, vehiclesResponse] = await Promise.all([
          api.get("/symptoms"),
          api.get("/vehicles/user"),
        ]);

        setSymptoms(symptomsResponse.data.data);
        setUserVehicles(vehiclesResponse.data);

        // Set default selected vehicle if user has vehicles
        if (vehiclesResponse.data.length > 0) {
          setSelectedVehicleId(vehiclesResponse.data[0].id);
        }
      } catch (error) {
        console.error(error.response?.data?.error || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAvailableSlots = async (selectedDate) => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const response = await api.get("/reservations/available-slots", {
        params: { date: selectedDate, serviceType },
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error(
        error.response?.data?.error || "Failed to fetch available slots"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (formattedDate && !isOtherSymptom) {
      fetchAvailableSlots(formattedDate);
    }
  }, [serviceType, formattedDate, isOtherSymptom]);

  useEffect(() => {
    const determineServiceType = () => {
      if (symptomIds.length > 0) {
        const selectedSymptoms = symptoms.filter((symptom) =>
          symptomIds.includes(symptom.id)
        );
        if (
          selectedSymptoms.some((symptom) => symptom.serviceType === "major")
        ) {
          setServiceType("major");
        } else {
          setServiceType("regular");
        }
      } else {
        setServiceType("regular");
      }
    };

    determineServiceType();
  }, [symptomIds, symptoms]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (!time && !isOtherSymptom) {
      alert("Please select a time slot");
      return;
    }

    if (!selectedVehicleId) {
      alert("Please select a vehicle");
      return;
    }

    if (serviceType === "major" && !isOtherSymptom) {
      const allowedHours = ["13:00", "15:00"];
      if (!allowedHours.includes(time)) {
        alert("Servis besar hanya tersedia pada jam 13:00 dan 15:00");
        return;
      }
    }

    setIsLoading(true);
    try {
      await api.post("/reservations", {
        date: formattedDate,
        time: isOtherSymptom ? null : time,
        symptomIds: isOtherSymptom ? [] : symptomIds,
        description,
        vehicleId: selectedVehicleId,
        otherSymptomDescription: isOtherSymptom ? description : null,
      });
      navigate("/reservations");
    } catch (error) {
      toast("Reservasi Gagal!", {
        description: error.response?.data?.error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const today = new Date();
  const tomorrow = addDays(today, 1);

  // Function to check if a date should be disabled
  const isDateDisabled = (date) => {
    if (!date) return false;
    return date < tomorrow;
  };

  // Get selected vehicle details
  const selectedVehicle = userVehicles.find((v) => v.id === selectedVehicleId);

  const renderSection = (icon, title, content) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-lg font-medium">
        {icon}
        <h3>{title}</h3>
      </div>
      <Separator className="bg-border" />
      <div className="pt-1">{content}</div>
    </div>
  );

  return (
    <div className="container">
      <Card className="border-none">
        <CardHeader className="bg-background text-foreground rounded-t-lg">
          <CardTitle className="text-xl md:text-2xl flex items-center">
            <WrenchIcon className="mr-2 h-5 w-5 md:h-6 md:w-6 flex-shrink-0" />
            <span>Buat Reservasi</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Jadwalkan servis untuk kendaraan Anda
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8 pt-6">
            {/* Vehicle Selection Section */}
            {renderSection(
              <CarIcon className="h-5 w-5 text-foreground flex-shrink-0" />,
              "Vehicle Information",
              <div>
                <Label htmlFor="vehicle-select" className="text-sm font-medium">
                  Pilih Kendaraan Anda
                </Label>
                <Select
                  value={selectedVehicleId}
                  onValueChange={setSelectedVehicleId}
                >
                  <SelectTrigger
                    id="vehicle-select"
                    className="mt-1 w-full"
                    disabled={isLoading || userVehicles.length === 0}
                  >
                    <SelectValue placeholder="Pilih kendaraan" />
                  </SelectTrigger>
                  <SelectContent>
                    {userVehicles.length > 0 ? (
                      <SelectGroup>
                        <SelectLabel>Kendaraan Tersedia</SelectLabel>
                        {userVehicles.map((vehicle) => (
                          <SelectItem
                            key={vehicle.id}
                            value={`${vehicle.id} ${vehicle.type} ${vehicle.productionYear}`}
                          >
                            {vehicle.brand} {vehicle.type} (
                            {vehicle.productionYear})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ) : (
                      <SelectGroup>
                        <SelectItem value="no-vehicle" disabled>
                          Tidak ada kendaraan ditemukan
                        </SelectItem>
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>

                {userVehicles.length === 0 && (
                  <div className="mt-2 p-3 bg-warning/10 border border-warning/30 rounded-md flex flex-col items-center">
                    <p className="text-sm text-primary flex items-center">
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                      Anda belum menambahkan kendaraan. Silakan tambahkan
                      kendaraan terlebih dahulu.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2 text-xs"
                      onClick={() => navigate("/vehicles/add")}
                    >
                      Tambah Kendaraan
                    </Button>
                  </div>
                )}

                {selectedVehicle && (
                  <div className="mt-2 p-3 bg-muted/20 rounded-md">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Merk/Model:
                        </span>
                        <p className="font-medium">
                          {selectedVehicle.brand} {selectedVehicle.type}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tahun:</span>
                        <p className="font-medium">
                          {selectedVehicle.productionYear}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Symptoms Selection Section */}
            {renderSection(
              <ClockIcon className="h-5 w-5 text-foreground flex-shrink-0" />,
              "Detail Servis",
              <>
                <Label className="mb-2 block text-sm font-medium">
                  Pilih gejala yang terjadi pada kendaraan anda
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  {symptoms.map((symptom) => (
                    <div
                      key={symptom.id}
                      className="flex items-center space-x-2 hover:bg-muted/50 p-2 rounded-md transition-colors"
                    >
                      <Checkbox
                        id={`symptom-${symptom.id}`}
                        checked={symptomIds.includes(symptom.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSymptomIds([...symptomIds, symptom.id]);
                          } else {
                            setSymptomIds(
                              symptomIds.filter((id) => id !== symptom.id)
                            );
                          }
                        }}
                        disabled={isOtherSymptom}
                      />
                      <Label
                        htmlFor={`symptom-${symptom.id}`}
                        className={cn(
                          "cursor-pointer text-sm flex-1",
                          isOtherSymptom && "opacity-50"
                        )}
                      >
                        {symptom.name}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Checkbox untuk gejala lain */}
                <div className="mt-6 border border-warning/50 bg-muted/20 p-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-warning flex-shrink-0" />
                    <span className="text-lg font-semibold text-foreground">
                      Gejala lain / Deskripsi Reservasi
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Jika Anda tidak menemukan gejala yang sesuai, pilih opsi ini
                    dan deskripsikan gejalanya secara manual.
                  </p>

                  <div className="mt-3 flex items-center space-x-2">
                    <Checkbox
                      id="other-symptom"
                      checked={isOtherSymptom}
                      onCheckedChange={(checked) => {
                        setIsOtherSymptom(checked);
                        if (checked) {
                          setSymptomIds([]);
                          setTime("");
                        }
                      }}
                    />
                    <Label
                      htmlFor="other-symptom"
                      className="text-sm font-medium"
                    >
                      Saya ingin mengisi gejala lain
                    </Label>
                  </div>

                  <div className="mt-4">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      {isOtherSymptom
                        ? "Deskripsikan gejala yang dirasakan"
                        : "Berikan deskripsi tambahan (opsional)"}
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="mt-1"
                      placeholder={
                        isOtherSymptom
                          ? "Masukkan deskripsi gejala..."
                          : "Contoh: Mobil sering mengalami overheat dan rem blong."
                      }
                      required={isOtherSymptom}
                    />
                  </div>
                </div>

                <div
                  className={cn(
                    "mt-4 flex flex-wrap items-center gap-2 transition-opacity",
                    isOtherSymptom && "opacity-50"
                  )}
                >
                  <span className="text-sm font-medium">Jenis Servis:</span>
                  <Badge
                    variant={serviceType === "major" ? "danger" : "purple"}
                    className="text-xs py-1"
                  >
                    {serviceType === "major" ? "Servis Besar" : "Servis Ringan"}
                  </Badge>
                  {serviceType === "major" && !isOtherSymptom && (
                    <span className="text-xs italic text-muted-foreground">
                      (Hanya tersedia pada pukul 13:00 & 15:00)
                    </span>
                  )}
                </div>
              </>
            )}

            {/* Schedule Section */}
            {renderSection(
              <CalendarIcon className="h-5 w-5 text-foreground flex-shrink-0" />,
              "Jadwal Service",
              <div className="space-y-4">
                <div>
                  <Label htmlFor="date" className="text-sm font-medium">
                    Pilih Tanggal
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? (
                          format(selectedDate, "PPP", { locale: id })
                        ) : (
                          <span>Pilih tanggal</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      {/* Replace the original Calendar with our CustomCalendar */}
                      <CustomCalendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          if (!isOtherSymptom) {
                            setTime("");
                          }
                          setCalendarOpen(false);
                        }}
                        disabled={(date) => isDateDisabled(date)}
                        initialFocus
                        className="border rounded-md"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {selectedDate && !isOtherSymptom && (
                  <div className="flex justify-between">
                    <Label className="text-sm font-medium ">
                      Pilih waktu operasional
                    </Label>
                    <div className="flex overflow-x-auto gap-2">
                      {availableSlots.length > 0 ? (
                        availableSlots.map((slot) => {
                          const isDisabled =
                            serviceType === "major" &&
                            !["13:00", "15:00"].includes(slot);

                          return (
                            <Button
                              key={slot}
                              type="button"
                              variant={time === slot ? "default" : "outline"}
                              className={cn(
                                "py-2 h-auto text-sm whitespace-nowrap", // Menambahkan whitespace-nowrap agar teks tidak wrap
                                isDisabled && "opacity-50 cursor-not-allowed",
                                time === slot && "font-medium"
                              )}
                              onClick={() => !isDisabled && setTime(slot)}
                              disabled={isDisabled}
                            >
                              {slot}
                            </Button>
                          );
                        })
                      ) : (
                        <p className="text-center text-muted-foreground text-sm py-2">
                          {isLoading
                            ? "Loading slots..."
                            : "No available slots for this date"}
                        </p>
                      )}
                    </div>

                    {serviceType === "major" && (
                      <p className="text-xs italic text-muted-foreground mt-2">
                        Servis besar hanya tersedia pada jam 13:00 dan 15:00
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-muted/40 flex flex-wrap justify-end gap-3 p-4 md:p-6 rounded-b-lg">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !selectedDate ||
                (!time && !isOtherSymptom) ||
                !selectedVehicleId
              }
              className="flex-1 sm:flex-none"
            >
              {isLoading ? "Processing..." : "Book Appointment"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateReservation;
