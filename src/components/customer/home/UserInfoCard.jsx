import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserIcon, PhoneIcon, MapPinIcon } from "lucide-react";

const UserInfoCard = ({ user }) => {
  return (
    <Card className="md:col-span-1 bg-background">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon size={20} />
          Informasi Pengguna
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <UserIcon size={16} className="mt-1 text-muted-foreground " />
            <div>
              <p className="text-sm text-muted-foreground ">Nama</p>
              <p className="font-medium">{user?.name || "Tidak tersedia"}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <PhoneIcon size={16} className="mt-1 text-muted-foreground " />
            <div>
              <p className="text-sm text-muted-foreground ">Nomor Telepon</p>
              <p className="font-medium">{user?.phone || "Tidak tersedia"}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPinIcon size={16} className="mt-1 text-muted-foreground " />
            <div>
              <p className="text-sm text-muted-foreground ">Alamat</p>
              <p className="font-medium">{user?.address || "Tidak tersedia"}</p>
            </div>
          </div>

          {user?.role && (
            <div className="flex items-start gap-2">
              <UserIcon size={16} className="mt-1 text-muted-foreground " />
              <div>
                <p className="text-sm text-muted-foreground ">Role</p>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
