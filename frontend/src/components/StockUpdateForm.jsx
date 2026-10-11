import { useState } from 'react';
import Button from './Button';

function StockUpdateForm({ product, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState({ type: 'IN', quantity: '', note: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    const minQty = form.type === 'ADJUSTMENT' ? 0 : 1;
    if (form.quantity === '' || Number(form.quantity) < minQty) {
      errs.quantity = form.type === 'ADJUSTMENT' ? 'Quantity must be 0 or more' : 'Quantity must be at least 1';
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit({
      type: form.type,
      quantity: parseInt(form.quantity, 10),
      note: form.note.trim() || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg bg-gray-50 px-4 py-3">
        <p className="text-sm font-medium text-gray-900">{product?.name}</p>
        <p className="text-xs text-gray-500">
          Current stock: <span className="font-semibold text-gray-700">{product?.quantity}</span>
        </p>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
          Movement Type
        </label>
        <select
          id="type"
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="IN">Stock In — Add inventory</option>
          <option value="OUT">Stock Out — Remove inventory</option>
          <option value="ADJUSTMENT">Adjustment — Set exact quantity</option>
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
          {form.type === 'ADJUSTMENT' ? 'New Quantity' : 'Quantity'}
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={form.type === 'ADJUSTMENT' ? '0' : '1'}
          placeholder={form.type === 'ADJUSTMENT' ? 'Set exact stock level' : 'Enter quantity'}
          value={form.quantity}
          onChange={handleChange}
          className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.quantity ? 'border-red-300 focus:ring-red-500' : 'border-gray-200'
          }`}
        />
        {errors.quantity && (
          <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>
        )}
      </div>

      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
          Note <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="note"
          name="note"
          rows={2}
          placeholder="Reason for update..."
          value={form.note}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update Stock'}
        </Button>
      </div>
    </form>
  );
}

export default StockUpdateForm;
