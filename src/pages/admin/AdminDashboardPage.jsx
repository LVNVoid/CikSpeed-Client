import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
    newUsers: 439,
  };

  const recentOrders = [
    {
      id: "4571",
      customer: "John Doe",
      status: "Completed",
      amount: "$245.99",
    },
    {
      id: "4572",
      customer: "Jane Smith",
      status: "Processing",
      amount: "$129.50",
    },
    {
      id: "4573",
      customer: "Mike Johnson",
      status: "Pending",
      amount: "$89.99",
    },
    {
      id: "4574",
      customer: "Sarah Williams",
      status: "Completed",
      amount: "$299.99",
    },
  ];

  return (
    <>
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.entries(userStatistics).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {value.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ↑ {Math.floor(Math.random() * 15) + 5}% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sales Overview Chart */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-end justify-between px-4">
              {salesData.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <motion.div
                    className="w-12 bg-primary rounded-t"
                    initial={{ height: 0 }}
                    animate={{ height: `${(item.sales / 2500) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  ></motion.div>
                  <span className="text-xs mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
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
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 text-sm">#{order.id}</td>
                      <td className="py-3 px-4 text-sm">{order.customer}</td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs 
                          ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : order.status === "Processing"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }
                        `}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-center">
              <Button variant="outline">View All Orders</Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default AdminDashboardPage;
