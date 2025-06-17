import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, Users, TrendingUp, Calendar } from "lucide-react";

const AdminDashboardPage = () => {
  // Sample data for charts
  const salesData = [
    { month: "Jan", sales: 1200 },
    { month: "Feb", sales: 1900 },
    { month: "Mar", sales: 1500 },
    { month: "Apr", sales: 2100 },
    { month: "May", sales: 2400 },
    { month: "Jun", sales: 1800 },
  ];

  const userStatistics = {
    totalUsers: 14389,
    activeUsers: 8745,
    newUsers: 4390,
  };

  const recentOrders = [
    {
      id: "4571",
      customer: "John Doe",
      status: "Completed",
      date: "2025-03-10",
      amount: "$245.99",
    },
    {
      id: "4572",
      customer: "Jane Smith",
      status: "Processing",
      date: "2025-03-12",
      amount: "$129.50",
    },
    {
      id: "4573",
      customer: "Mike Johnson",
      status: "Pending",
      date: "2025-03-14",
      amount: "$89.99",
    },
    {
      id: "4574",
      customer: "Sarah Williams",
      status: "Completed",
      date: "2025-03-15",
      amount: "$299.99",
    },
  ];

  // Status badge renderer
  const StatusBadge = ({ status }) => {
    const statusStyles = {
      Completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      Processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      Pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs ${statusStyles[status]}`}
      >
        {status}
      </span>
    );
  };

  // Stat card renderer
  // const StatCard = ({ title, value, icon, percentChange, color }) => {
  //   const IconComponent = icon;
  //   return (
  //     <Card className="overflow-hidden">
  //       <CardContent className="p-6">
  //         <div className="flex items-center justify-between">
  //           <div>
  //             <p className="text-sm font-medium text-muted-foreground mb-1">
  //               {title}
  //             </p>
  //             <h3 className="text-2xl font-bold">{value.toLocaleString()}</h3>
  //             <div className="flex items-center mt-2 text-xs">
  //               <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
  //               <span className="text-green-500 font-medium">
  //                 {percentChange}%
  //               </span>
  //               <span className="text-muted-foreground ml-1">
  //                 from last month
  //               </span>
  //             </div>
  //           </div>
  //           <div className={`p-3 rounded-lg ${color}`}>
  //             <IconComponent className="w-6 h-6 text-white" />
  //           </div>
  //         </div>
  //       </CardContent>
  //     </Card>
  //   );
  // };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin</p>
        </div>
        {/* <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            March 2025
          </Button>
          <Button>
            <TrendingUp className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div> */}
      </div>

      {/* Dashboard Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Users"
            value={userStatistics.totalUsers}
            icon={Users}
            percentChange={12}
            color="bg-blue-500"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Active Users"
            value={userStatistics.activeUsers}
            icon={Users}
            percentChange={8}
            color="bg-green-500"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="New Users"
            value={userStatistics.newUsers}
            icon={Users}
            percentChange={15}
            color="bg-purple-500"
          />
        </motion.div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>
                  Monthly sales performance for the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full flex items-end justify-between px-4 mt-4">
                  {salesData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <motion.div
                        className="w-12 bg-primary rounded-t"
                        style={{
                          background: `linear-gradient(to top, #3b82f6, #8b5cf6)`,
                          boxShadow: "0 4px 6px -1px rgba(59, 130, 246, 0.3)",
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${(item.sales / 2500) * 100}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      ></motion.div>
                      <span className="text-xs mt-2 font-medium">
                        {item.month}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ${item.sales}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>
                    You have {recentOrders.length} orders this month
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                          ID
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                          Customer
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                          Date
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order, index) => (
                        <tr
                          key={index}
                          className="border-b hover:bg-muted/20 transition-colors"
                        >
                          <td className="py-3 px-4 text-sm font-medium">
                            #{order.id}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {order.customer}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {order.date}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {order.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="sales">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Detailed sales data and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-10">
                Sales analytics content would go here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                Manage and track all customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-10">
                Order management content would go here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs> */}
    </div>
  );
};

export default AdminDashboardPage;
