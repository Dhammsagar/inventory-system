import { useState, useEffect } from 'react';
import useProducts from '../hooks/useProducts';
import useDebounce from '../hooks/useDebounce';
import { updateStock } from '../api/stock';
import { Card } from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import ProductForm from '../components/ProductForm';
import StockUpdateForm from '../components/StockUpdateForm';
import { Search, Plus, Pencil, Trash2, Package, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';

function extractError(err) {
  const data = err.response?.data;
  if (data?.fieldErrors) {
    return Object.values(data.fieldErrors).join(', ');
  }
  return data?.message || err.message || 'Something went wrong';
}

function statusBadge(product) {
  if (product.quantity === 0) return <Badge variant="gray">Out of Stock</Badge>;
  if (product.lowStock) return <Badge variant="red">Low Stock</Badge>;
  return <Badge variant="green">In Stock</Badge>;
}

function ProductsPage() {
  const {
    products,
    loading,
    setSearch,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts();

  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 400);

  const [formModal, setFormModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [stockModal, setStockModal] = useState(false);
  const [stockProduct, setStockProduct] = useState(null);
  const [stockSubmitting, setStockSubmitting] = useState(false);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  const openCreate = () => {
    setEditingProduct(null);
    setFormModal(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setFormModal(true);
  };

  const closeForm = () => {
    setFormModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await editProduct(editingProduct.id, data);
      } else {
        await addProduct(data);
      }
      closeForm();
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const openDelete = (product) => {
    setDeletingProduct(product);
    setDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setDeleting(true);
    try {
      await removeProduct(deletingProduct.id);
      setDeleteModal(false);
      setDeletingProduct(null);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setDeleting(false);
    }
  };

  const openStock = (product) => {
    setStockProduct(product);
    setStockModal(true);
  };

  const closeStock = () => {
    setStockModal(false);
    setStockProduct(null);
  };

  const handleStockUpdate = async (data) => {
    if (!stockProduct) return;
    setStockSubmitting(true);
    try {
      await updateStock(stockProduct.id, data);
      toast.success('Stock updated');
      closeStock();
      fetchProducts(debouncedSearch);
    } catch (err) {
      toast.error(extractError(err));
    } finally {
      setStockSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {loading ? (
        <Spinner className="h-64" />
      ) : products.length === 0 ? (
        <Card>
          <EmptyState
            icon={Package}
            title="No products found"
            description={searchInput ? 'Try a different search term.' : 'Get started by adding your first product.'}
            action={
              !searchInput && (
                <Button size="sm" onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">{p.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{p.category || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">${Number(p.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{p.quantity}</td>
                    <td className="px-6 py-4">{statusBadge(p)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openStock(p)}
                          className="rounded-lg p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Update Stock"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDelete(p)}
                          className="rounded-lg p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={formModal}
        onClose={closeForm}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          submitting={submitting}
        />
      </Modal>

      <Modal
        isOpen={stockModal}
        onClose={closeStock}
        title="Update Stock"
      >
        <StockUpdateForm
          product={stockProduct}
          onSubmit={handleStockUpdate}
          onCancel={closeStock}
          submitting={stockSubmitting}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => { setDeleteModal(false); setDeletingProduct(null); }}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}

export default ProductsPage;
