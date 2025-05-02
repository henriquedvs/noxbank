
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  animated?: boolean;
}

const Logo = ({ className, animated = false }: LogoProps) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn("h-10 w-10 bg-nox-primary rounded-full flex items-center justify-center", 
        animated && "animate-logo-pulse")}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 7L12 3L20 7V17L12 21L4 17V7Z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 12L12 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 12L20 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 12L4 7"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-xl font-bold">
        <span className="text-nox-primary">Nox</span>
        <span className="text-white">Bank</span>
      </span>
    </div>
  );
};

export default Logo;
