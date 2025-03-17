/* eslint-disable react/prop-types */
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
              <p className="font-medium">{user?.name}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <PhoneIcon size={16} className="mt-1 text-muted-foreground " />
            <div>
              <p className="text-sm text-muted-foreground ">Nomor Telepon</p>
              <p className="font-medium">{`+62${user?.phone}`}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <MapPinIcon size={16} className="mt-1 text-muted-foreground " />
            <div>
              <p className="text-sm text-muted-foreground ">Alamat</p>
              <p className="font-medium">{user?.address}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfoCard;
