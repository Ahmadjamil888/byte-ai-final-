export default function ByteAIIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg 
      className={className}
      fill="none" 
      viewBox="0 0 24 24" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="byteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF6600" />
          <stop offset="100%" stopColor="#FF8533" />
        </linearGradient>
      </defs>
      {/* AI Brain/Circuit Pattern */}
      <path
        d="M12 2C13.1 2 14 2.9 14 4V6H16C17.1 6 18 6.9 18 8V10C19.1 10 20 10.9 20 12C20 13.1 19.1 14 18 14V16C18 17.1 17.1 18 16 18H14V20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20V18H8C6.9 18 6 17.1 6 16V14C4.9 14 4 13.1 4 12C4 10.9 4.9 10 6 10V8C6 6.9 6.9 6 8 6H10V4C10 2.9 10.9 2 12 2Z"
        fill="url(#byteGradient)"
      />
      {/* Inner circuit lines */}
      <path
        d="M12 8V10M12 14V16M8 12H10M14 12H16M9.5 9.5L10.5 10.5M13.5 10.5L14.5 9.5M9.5 14.5L10.5 13.5M13.5 13.5L14.5 14.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Central core */}
      <circle cx="12" cy="12" r="2" fill="white" />
    </svg>
  );
}