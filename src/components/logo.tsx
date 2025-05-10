
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface LogoProps {
  className?: string;
  animated?: boolean;
}

const Logo = ({ className, animated = false }: LogoProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsLoaded(true), 300);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(true);
    }
  }, [animated]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={cn("relative", 
        animated && "transition-all duration-1000 ease-in-out transform",
        animated && (isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"))}>
        <img 
          src="/lovable-uploads/06e568a7-047e-420a-89a8-f1b56ecda980.png"
          alt="Nox Logo"
          className="h-12 w-auto"
        />
      </div>
    </div>
  );
};

export default Logo;
