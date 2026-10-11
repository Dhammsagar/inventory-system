const variants = {
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  red: 'bg-red-50 text-red-700 ring-red-600/20',
  yellow: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  blue: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  gray: 'bg-gray-50 text-gray-700 ring-gray-600/20',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
};

function Badge({ children, variant = 'gray', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export default Badge;
