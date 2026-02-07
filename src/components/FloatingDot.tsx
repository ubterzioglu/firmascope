interface FloatingDotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
  variant?: "default" | "slow" | "drift";
  color?: "blue" | "green" | "orange" | "yellow";
}

const FloatingDot = ({ className = "", size = "md", delay = 0, variant = "default", color = "blue" }: FloatingDotProps) => {
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

  const colorClasses = {
    blue: "bg-alm-blue/25",
    green: "bg-alm-green/25",
    orange: "bg-alm-orange/25",
    yellow: "bg-alm-yellow/25",
  };

  return (
    <div
      className={`absolute rounded-full blur-[1px] ${colorClasses[color]} ${animationClass[variant]} ${sizeClasses[size]} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
};

export default FloatingDot;
