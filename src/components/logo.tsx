export function Logo({ className }: { className?: string }) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-primary text-primary-foreground ${className || 'w-10 h-10'}`}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-2/3 w-2/3"
        >
            {/* Base of the logo - representing a location pin and open arms */}
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            {/* Inner circle - representing the 'oneness' or central point */}
            <circle cx="12" cy="9" r="2.5" />
            {/* The 'open hands' or 'welcoming' element */}
            <path d="M5 19s2.5-1.5 7-1.5 7 1.5 7 1.5"/>
        </svg>
      </div>
    );
  }
  