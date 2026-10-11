import { useState, useEffect } from 'react';
import Button from './Button';

const initialForm = {
  name: '',
  sku: '',
  category: '',
  price: '',
  quantity: '',
  reorderLevel: '',
};

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required';
  if (!form.sku.trim()) errors.sku = 'SKU is required';
  if (!form.price || Number(form.price) <= 0) errors.price = 'Price must be greater than 0';
  if (form.quantity === '' || Number(form.quantity) < 0) errors.quantity = 'Quantity must be 0 or more';
  if (form.reorderLevel === '' || Number(form.reorderLevel) < 0) errors.reorderLevel = 'Reorder level must be 0 or more';
  return errors;
}

function ProductForm({ product, onSubmit, onCancel, submitting = false }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        price: product.price?.toString() || '',
        quantity: product.quantity?.toString() || '',
        reorderLevel: product.reorderLevel?.toString() || '',
      });
    } else {
      setForm(initialForm);
    }
    setErrors({});
  }, [product]);

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
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim(),
      category: form.category.trim(),
      price: parseFloat(form.price),
      quantity: parseInt(form.quantity, 10),
      reorderLevel: parseInt(form.reorderLevel, 10),
    });
  };

  const fields = [
    { name: 'name', label: 'Product Name', type: 'text', placeholder: 'Wireless Mouse' },
    { name: 'sku', label: 'SKU', type: 'text', placeholder: 'WM-001' },
    { name: 'category', label: 'Category', type: 'text', placeholder: 'Electronics', required: false },
    { name: 'price', label: 'Price', type: 'number', placeholder: '29.99', step: '0.01', min: '0.01' },
    { name: 'quantity', label: 'Quantity', type: 'number', placeholder: '100', min: '0' },
    { name: 'reorderLevel', label: 'Reorder Level', type: 'number', placeholder: '10', min: '0' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={f.name} className="block text-sm font-medium text-gray-700 mb-1">
            {f.label}
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            placeholder={f.placeholder}
            step={f.step}
            min={f.min}
            value={form[f.name]}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors[f.name]
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          />
          {errors[f.name] && (
            <p className="mt-1 text-xs text-red-600">{errors[f.name]}</p>
          )}
        </div>
      ))}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : product ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

export default ProductForm;
