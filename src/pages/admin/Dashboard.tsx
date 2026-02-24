import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { dashboardApi } from '@/services/api';
import { formatPrice, formatNumber } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import type { DashboardStats } from '@/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const data = await dashboardApi.getStats();
      setStats(data);
      setIsLoading(false);
    };
    loadStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-botanical-200 border-t-botanical-600 rounded-full" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Revenus totaux',
      value: formatPrice(stats.totalRevenue),
      change: stats.revenueChange,
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
    {
      title: 'Commandes',
      value: formatNumber(stats.totalOrders),
      change: stats.ordersChange,
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    },
    {
      title: 'Produits',
      value: formatNumber(stats.totalProducts),
      change: stats.productsChange,
      icon: Package,
      color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    },
    {
      title: 'Clients',
      value: formatNumber(stats.totalCustomers),
      change: stats.customersChange,
      icon: Users,
      color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((stat) => (
          <motion.div key={stat.title} variants={fadeUpVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.change >= 0 ? (
                    <>
                      <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm text-emerald-600">+{stat.change}%</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4 text-rose-600" />
                      <span className="text-sm text-rose-600">{stat.change}%</span>
                    </>
                  )}
                  <span className="text-sm text-muted-foreground ml-1">vs mois dernier</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Évolution des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.salesChart}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#527f52" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#527f52" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="label" 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    tickFormatter={(value) => `${value} MAD`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value} MAD`, 'Ventes']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#527f52" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Orders & Top Products */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Commandes récentes</CardTitle>
              <Link 
                to="/admin/orders" 
                className="text-sm text-botanical-600 hover:underline"
              >
                Voir tout
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.slice(0, 5).map((order) => (
                  <div 
                    key={order.id} 
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.length} article{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.total)}</p>
                      <span className={`
                        text-xs px-2 py-0.5 rounded-full
                        ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : ''}
                        ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                        ${order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : ''}
                        ${order.status === 'pending' ? 'bg-orange-100 text-orange-700' : ''}
                      `}>
                        {order.status === 'delivered' && 'Livré'}
                        {order.status === 'processing' && 'En traitement'}
                        {order.status === 'shipped' && 'Expédié'}
                        {order.status === 'pending' && 'En attente'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Produits populaires</CardTitle>
              <Link 
                to="/admin/products" 
                className="text-sm text-botanical-600 hover:underline"
              >
                Voir tout
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProducts.slice(0, 5).map((product, index) => (
                  <div 
                    key={product.id} 
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <span className="w-6 h-6 rounded-full bg-botanical-600 text-white text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <img
                      src={product.images.find(img => img.isMain)?.url || product.images[0]?.url}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category.name}</p>
                    </div>
                    <p className="font-medium">{formatPrice(product.price)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
