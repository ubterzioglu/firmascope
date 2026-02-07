interface FloatingDotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  variant?: "default" | "slow" | "drift";
}

const FloatingDot = ({ className = "", size = "md", delay = 0, variant = "default" }: FloatingDotProps) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-5 w-5",
  };

  const animationClass = {
    default: "animate-float",
    slow: "animate-float-slow",
    drift: "animate-drift",
  };

  return (
    <div
      className={`absolute rounded-full bg-primary/20 blur-[1px] ${animationClass[variant]} ${sizeClasses[size]} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
};

export default FloatingDot;
