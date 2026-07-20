/**
 * ListMate brand monogram — Electric Indigo palette.
 * Self-contained SVG badge, drop it anywhere.
 * Props:
 *   size      — pixel dimension (width = height). Default 44.
 *   className — extra classes forwarded to the <svg>.
 */
export default function LogoMark({ size = 44, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ListMate"
      className={className}
    >
      {/* Shadow depth */}
      <rect x="2" y="3" width="60" height="61" rx="16" fill="#1e1b4b" opacity="0.7" />
      {/* Badge face */}
      <rect width="62" height="62" rx="15" fill="#3730a3" />
      {/* Inner face */}
      <rect x="3" y="3" width="58" height="58" rx="13" fill="#4f46e5" />
      {/* Top shine */}
      <rect x="3" y="3" width="58" height="22" rx="13" fill="#6366f1" opacity="0.55" />
      <rect x="3" y="18" width="58" height="7" fill="#4f46e5" />
      {/* Tag hole */}
      <circle cx="31" cy="9" r="4.5" fill="#3730a3" />
      <circle cx="31" cy="9" r="2.8" fill="#1e1b4b" />
      {/* LM monogram */}
      <text
        x="31"
        y="34"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="white"
        letterSpacing="-1"
      >
        LM
      </text>
      {/* List lines */}
      <rect x="12" y="46" width="40" height="3.5" rx="1.75" fill="white" opacity="0.80" />
      <rect x="12" y="52" width="28" height="3.5" rx="1.75" fill="white" opacity="0.55" />
      <rect x="12" y="58" width="34" height="3.5" rx="1.75" fill="white" opacity="0.38" />
    </svg>
  );
}
