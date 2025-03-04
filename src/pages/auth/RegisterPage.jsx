import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { toast } from "sonner";

// Import komponen shadcn/ui
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (phone) {
      const regex = /^8[1-9][0-9]{7,9}$/;
      setIsPhoneValid(regex.test(phone));
    } else {
      setIsPhoneValid(true);
    }
  }, [phone]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!isPhoneValid) {
      setError(
        "Nomor telepon tidak valid. Masukkan tanpa +62 atau 0. Contoh: 81234567890."
      );
      toast.error(
        "Nomor telepon tidak valid. Masukkan tanpa +62 atau 0. Contoh: 81234567890."
      );
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        phone,
        address,
        password,
      });

      toast.success("Registrasi berhasil! Silakan login.");
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.error || "Registrasi gagal. Silakan coba lagi."
      );
      toast.error(
        error.response?.data?.error || "Registrasi gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 px-4">
      <Card className="w-full max-w-lg shadow-2xl rounded-2xl border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Buat Akun
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Isi data di bawah ini untuk membuat akun baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-muted-foreground">
                Nama Lengkap
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Budi Santoso"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-muted-foreground">
                Nomor Telepon
              </Label>
              <div className="flex items-center mt-1">
                <div className="flex items-center border rounded-md p-2 bg-muted">
                  <img
                    src="https://flagcdn.com/id.svg"
                    alt="Indonesia"
                    className="w-5 h-3.5 mr-2"
                  />
                  <span className="text-muted-foreground">+62</span>
                </div>
                <Input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="81234567890"
                  className={`ml-2 flex-1 ${
                    !isPhoneValid && phone ? "border-destructive" : ""
                  }`}
                  required
                />
              </div>
              {!isPhoneValid && phone && (
                <p className="text-sm text-destructive mt-1">
                  Nomor telepon tidak valid. Masukkan **tanpa +62 atau 0**.
                  <br />
                  Contoh: <strong>81234567890</strong>.
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="address" className="text-muted-foreground">
                Alamat
              </Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Masukkan alamat lengkap"
                className="min-h-20 mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-muted-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat password baru"
                className="mt-1"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading || !isPhoneValid}
            >
              {loading ? "Memproses..." : "Daftar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/login")}
              className="text-primary font-medium hover:text-primary/80 p-0"
            >
              Login disini
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
