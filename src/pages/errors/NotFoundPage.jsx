import React from "react";
import { Search, Home, ChevronLeft } from "lucide-react";
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

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <Search className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Halaman Tidak Ditemukan
          </CardTitle>
          <CardDescription>Error 404</CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Halaman yang Anda cari tidak ada atau telah dipindahkan.
          </p>
          <Alert variant="purple">
            <AlertDescription>
              Periksa URL atau coba navigasi ke halaman lain.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button className="flex-1" variant="outline" size="lg">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button
            className="flex-1"
            variant="default"
            size="lg"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Beranda
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFoundPage;
