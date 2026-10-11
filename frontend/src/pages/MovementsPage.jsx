import { useState, useEffect } from 'react';
import { getAllMovements } from '../api/stock';
import { getProducts } from '../api/products';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { ChevronLeft, ChevronRight, ArrowRightLeft, Filter } from 'lucide-react';

function movementBadgeVariant(type) {
  if (type === 'IN') return 'green';
  if (type === 'OUT') return 'red';
  return 'yellow';
}

function MovementsPage() {
  const [movements, setMovements] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [typeFilter, setTypeFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, []);

  const fetchMovements = () => {
    setLoading(true);
    const params = { page, size: 15 };
    if (typeFilter) params.type = typeFilter;
    if (productFilter) params.productId = productFilter;
    getAllMovements(params)
      .then((res) => {
        setMovements(res.data.content);
        setTotalPages(res.data.totalPages);
        setTotalElements(res.data.totalElements);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMovements();
  }, [page, typeFilter, productFilter]);

  const resetFilters = () => {
    setTypeFilter('');
    setProductFilter('');
    setPage(0);
  };

  const hasFilters = typeFilter || productFilter;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-500">Filters:</span>
        </div>
        <select
          value={productFilter}
          onChange={(e) => { setProductFilter(e.target.value); setPage(0); }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 max-w-xs"
        >
          <option value="">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
          className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Types</option>
          <option value="IN">IN</option>
          <option value="OUT">OUT</option>
          <option value="ADJUSTMENT">ADJUSTMENT</option>
        </select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {loading ? (
        <Spinner className="h-64" />
      ) : movements.length === 0 ? (
        <Card>
          <EmptyState
            icon={ArrowRightLeft}
            title="No movements found"
            description={hasFilters ? 'Try adjusting your filters.' : 'Stock movements will appear here once created.'}
            action={
              hasFilters && (
                <Button variant="secondary" size="sm" onClick={resetFilters}>
                  Clear filters
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <>
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Previous</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">New</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{m.productName}</p>
                          <p className="text-xs text-gray-400 font-mono">{m.productSku}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={movementBadgeVariant(m.type)}>{m.type}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.quantity}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{m.previousStock}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{m.newStock}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[200px] truncate">{m.note || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {page * 15 + 1}–{Math.min((page + 1) * 15, totalElements)} of {totalElements} movements
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-700 min-w-[80px] text-center">
                {page + 1} / {totalPages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MovementsPage;
