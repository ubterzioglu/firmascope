interface FloatingDotProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: number;
}

const FloatingDot = ({ className = "", size = "md", delay = 0 }: FloatingDotProps) => {
  const sizeClasses = {
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };

  return (
    <div
      className={`absolute rounded-full bg-primary/15 animate-float ${sizeClasses[size]} ${className}`}
      style={{ animationDelay: `${delay}s` }}
    />
  );
};

export default FloatingDot;
