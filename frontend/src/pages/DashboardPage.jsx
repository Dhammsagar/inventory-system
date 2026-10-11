import { useState, useEffect } from 'react';
import { getDashboard } from '../api/dashboard';
import { getLowStockProducts } from '../api/products';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Database,
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  RefreshCw,
} from 'lucide-react';

function StatCard({ label, value, icon: Icon, color, bgColor }) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`rounded-xl p-3 ${bgColor}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </Card>
  );
}

function MovementTypeIcon({ type }) {
  if (type === 'IN') return <ArrowDownToLine className="h-4 w-4 text-emerald-600" />;
  if (type === 'OUT') return <ArrowUpFromLine className="h-4 w-4 text-red-600" />;
  return <RefreshCw className="h-4 w-4 text-amber-600" />;
}

function movementBadgeVariant(type) {
  if (type === 'IN') return 'green';
  if (type === 'OUT') return 'red';
  return 'yellow';
}

function DashboardPage() {
  const [data, setData] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getLowStockProducts()])
      .then(([dashRes, lowRes]) => {
        setData(dashRes.data);
        setLowStock(lowRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Spinner className="h-64" />;
  }

  if (!data) {
    return <EmptyState title="Failed to load dashboard" description="Please check that the backend is running." />;
  }

  const stats = [
    {
      label: 'Total Products',
      value: data.totalProducts,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Stock Units',
      value: data.totalStockUnits.toLocaleString(),
      icon: Database,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Inventory Value',
      value: `$${Number(data.totalInventoryValue).toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      label: 'Low Stock',
      value: data.lowStockCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <h3 className="text-sm font-semibold text-gray-900">Low Stock Items</h3>
            </div>
            <Badge variant="red">{lowStock.length} items</Badge>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState title="All stocked up" description="No products below reorder level." />
          ) : (
            <div className="divide-y divide-gray-100">
              {lowStock.slice(0, 6).map((p) => (
                <div key={p.id} className="px-6 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.sku}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-red-600">{p.quantity}</p>
                      <p className="text-xs text-gray-400">of {p.reorderLevel}</p>
                    </div>
                    <div className="w-16 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="bg-red-500 h-1.5 rounded-full"
                        style={{
                          width: `${Math.min(100, p.reorderLevel > 0 ? (p.quantity / p.reorderLevel) * 100 : 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card padding={false}>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4 text-indigo-500" />
            <h3 className="text-sm font-semibold text-gray-900">Recent Movements</h3>
          </div>
          {(!data.recentMovements || data.recentMovements.length === 0) ? (
            <EmptyState
              icon={ArrowRightLeft}
              title="No movements yet"
              description="Stock movements will appear here."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {data.recentMovements.map((m) => (
                <div key={m.id} className="px-6 py-3 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gray-50 shrink-0">
                    <MovementTypeIcon type={m.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{m.productName}</p>
                      <Badge variant={movementBadgeVariant(m.type)}>{m.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {m.previousStock} → {m.newStock} · {m.quantity} units
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default DashboardPage;
