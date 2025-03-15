import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

import api from "@/services/api";
import { Badge } from "@/components/ui/badge";
import {
  capitalizeFirstLetter,
  formatDate,
  getRoleBadgeVariant,
} from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get("/auth/users");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <section className="mb-6">
        {/* Title */}
        <h1 className="text-2xl font-bold mb-6">User Management</h1>
      </section>

      <section className="mb-6">
        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                {filterRole === "all" ? "All Roles" : filterRole}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterRole("all")}>
                All Roles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("admin")}>
                Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("frontdesk")}>
                Frontdesk
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole("customer")}>
                Customer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">ID</TableHead>
                <TableHead className="whitespace-nowrap">Nama</TableHead>
                <TableHead className="whitespace-nowrap">
                  Nomor Telepon
                </TableHead>
                <TableHead className="whitespace-nowrap">Alamat</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="whitespace-nowrap">
                  Tanggal Dibuat
                </TableHead>
                <TableHead className="whitespace-nowrap">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent" />
                      <span>Loading...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-10 text-gray-500"
                  >
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="whitespace-nowrap font-medium">
                      {user.id}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      +62{user.phone}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {user.address}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {capitalizeFirstLetter(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(user.createdAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                          {isAdmin && (
                            <>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                Hapus
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {!loading && filteredUsers.length > 0 && (
          <div className="text-sm text-gray-500 mt-4">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default UsersPage;
