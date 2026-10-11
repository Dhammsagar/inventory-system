function Card({ children, className = '', padding = true }) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${
        padding ? 'p-6' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-base font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export { Card, CardHeader, CardTitle, CardBody };
