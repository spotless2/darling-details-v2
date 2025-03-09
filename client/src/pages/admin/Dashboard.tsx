import { motion } from "framer-motion";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp
} from "lucide-react";

const STATS = [
  {
    title: "Total Products",
    value: "124",
    change: "+4.75%",
    icon: Package,
  },
  {
    title: "Active Rentals",
    value: "45",
    change: "+10.2%",
    icon: ShoppingCart,
  },
  {
    title: "Total Customers",
    value: "2,300",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Revenue",
    value: "23.5K",
    change: "+8.3%",
    icon: TrendingUp,
  },
];

export default function Dashboard() {
  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <motion.h1 
            className="text-2xl font-display"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome back, Admin
          </motion.h1>
          <motion.p 
            className="text-gray-500 mt-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Here's what's happening with your store today.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-500 mt-1">
                      <span>{stat.change}</span>
                      <span className="text-gray-500 ml-1">vs last month</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * i }}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4" />
                  <div>
                    <h3 className="font-medium">Product {i}</h3>
                    <p className="text-sm text-gray-500">Added 2 days ago</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AdminLayout>
  );
}