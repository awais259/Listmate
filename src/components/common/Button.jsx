const variants = {
  primary:  'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30',
  secondary:'bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10',
  danger:   'bg-red-600 hover:bg-red-500 text-white',
  ghost:    'hover:bg-white/5 text-slate-300 hover:text-white',
  outline:  'border border-violet-500/50 text-violet-400 hover:bg-violet-500/10 hover:border-violet-400',
  success:  'bg-green-600 hover:bg-green-500 text-white',
};

const sizes = {
  xs: 'px-2.5 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  icon,
  iconRight,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 cursor-pointer
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
        </svg>
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}
