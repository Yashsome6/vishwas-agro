import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "destructive" | "info";
  onClick?: () => void;
}

const variantStyles = {
  default: {
    bg: "bg-primary/5",
    text: "text-primary",
    border: "border-primary/10",
  },
  success: {
    bg: "bg-success/5",
    text: "text-success",
    border: "border-success/10",
  },
  warning: {
    bg: "bg-warning/5",
    text: "text-warning",
    border: "border-warning/10",
  },
  destructive: {
    bg: "bg-destructive/5",
    text: "text-destructive",
    border: "border-destructive/10",
  },
  info: {
    bg: "bg-info/5",
    text: "text-info",
    border: "border-info/10",
  },
};

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  onClick,
}: MetricCardProps) {
  const styles = variantStyles[variant];

  return (
    <Card
      className={cn(
        "hover-lift transition-smooth cursor-pointer group overflow-hidden relative",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {/* Decorative gradient background */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
        styles.bg
      )} />
      
      <CardContent className="p-6 relative">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <h3 className={cn(
                "text-3xl font-bold tracking-tight animate-fade-in-up",
                styles.text
              )}>
                {value}
              </h3>
              {trend && (
                <span className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}>
                  {trend.isPositive ? "↑" : "↓"} {trend.value}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
            styles.bg,
            styles.border,
            "border group-hover:scale-110 group-hover:rotate-6"
          )}>
            <Icon className={cn("h-6 w-6", styles.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
