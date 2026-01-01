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
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 9.8c0 7.3-8 11.8-8 11.8z" />
          <circle cx="12" cy="10" r="3" />
          <path d="M5 20s2.5-1.5 7-1.5 7 1.5 7 1.5" />
        </svg>
      </div>
    );
  }