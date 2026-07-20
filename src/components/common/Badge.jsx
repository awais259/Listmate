const variants = {
  draft:   'bg-slate-800 text-slate-300 border border-slate-700',
  ready:   'bg-blue-900/40 text-blue-300 border border-blue-700/50',
  listed:  'bg-violet-900/40 text-violet-300 border border-violet-700/50',
  sold:    'bg-green-900/40 text-green-300 border border-green-700/50',
  new:     'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50',
  success: 'bg-green-900/40 text-green-300 border border-green-700/50',
  warning: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
  danger:  'bg-red-900/40 text-red-300 border border-red-700/50',
  info:    'bg-blue-900/40 text-blue-300 border border-blue-700/50',
  purple:  'bg-violet-900/40 text-violet-300 border border-violet-700/50',
  default: 'bg-slate-800 text-slate-300 border border-slate-700',
};

export default function Badge({ variant = 'default', children, className = '' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  );
}

export function statusVariant(status) {
  return status;
}

export function StatusBadge({ status }) {
  const labels = { draft: 'Draft', ready: 'Ready', listed: 'Listed', sold: 'Sold' };
  return <Badge variant={status}>{labels[status] || status}</Badge>;
}
