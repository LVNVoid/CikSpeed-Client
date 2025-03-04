import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "@/contexts/AuthContext";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const LoginPage = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

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
        "Nomor telepon tidak valid. Masukkan nomor tanpa +62 atau 0. Contoh: 81234567890."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        phone,
        password,
      });

      login(response.data.user);

      if (
        response.data.user.role === "admin" ||
        response.data.user.role === "frontdesk"
      ) {
        navigate("/admin/dashboard");
      } else if (response.data.user.role === "customer") {
        navigate("/home");
      }
      toast.success(
        `Login berhasil. Selamat datang, ${response.data.user.name}!`
      );
    } catch (error) {
      setError(
        error.response?.data?.error || "Login gagal. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 px-4">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">
            Login
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Masukkan nomor telepon dan password Anda untuk masuk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
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
                    Nomor telepon tidak valid. Masukkan **nomor tanpa +62 atau
                    0**.
                    <br />
                    Contoh: <strong>81234567890</strong>.
                  </p>
                )}
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
                  placeholder="Masukkan password"
                  className="mt-1"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading || !isPhoneValid}
            >
              {loading ? "Memproses..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Button
              variant="link"
              onClick={() => navigate("/register")}
              className="text-primary font-medium hover:text-primary/80 p-0"
            >
              Daftar disini
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
