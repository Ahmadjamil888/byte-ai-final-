export default function ByteAILogo() {
  return (
    <svg
      fill="none"
      height="20"
      viewBox="0 0 120 20"
      width="120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6600" />
          <stop offset="100%" stopColor="#FF8533" />
        </linearGradient>
      </defs>
      {/* BYTE */}
      <path
        d="M2 2V18H8C10.2 18 12 16.2 12 14C12 12.9 11.6 11.9 10.9 11.1C11.6 10.3 12 9.3 12 8C12 5.8 10.2 4 8 4H2ZM5 7H8C8.6 7 9 7.4 9 8C9 8.6 8.6 9 8 9H5V7ZM5 12H8C8.6 12 9 12.4 9 13C9 13.6 8.6 14 8 14H5V12Z"
        fill="url(#logoGradient)"
      />
      
      {/* Y */}
      <path
        d="M16 4L20 10V18H23V10L27 4H24L21.5 8L19 4H16Z"
        fill="url(#logoGradient)"
      />
      
      {/* T */}
      <path
        d="M31 4V7H35V18H38V7H42V4H31Z"
        fill="url(#logoGradient)"
      />
      
      {/* E */}
      <path
        d="M46 4V18H58V15H49V12H56V9H49V7H58V4H46Z"
        fill="url(#logoGradient)"
      />
      
      {/* AI */}
      <path
        d="M66 4L70 18H73L77 4H74L72 12L70 4H66ZM82 4V18H85V4H82ZM88 4V18H91V4H88Z"
        fill="white"
      />
    </svg>
  );
}