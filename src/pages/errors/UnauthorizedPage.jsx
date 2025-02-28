import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">Akses Ditolak</CardTitle>
          <CardDescription>Error 401</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Anda tidak memiliki izin untuk mengakses halaman ini. Silakan
            periksa kredensial Anda atau hubungi administrator untuk bantuan.
          </p>
          <Alert variant="destructive">
            <AlertDescription>
              Sesi Anda mungkin telah berakhir atau Anda tidak memiliki tingkat
              akses yang diperlukan.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            className="w-full"
            variant="default"
            onClick={() => navigate("/login")}
          >
            Masuk
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Kembali
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;
