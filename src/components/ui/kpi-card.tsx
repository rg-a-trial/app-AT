import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: ReactNode;
  tooltip?: string;
  variant?: 'default' | 'accent' | 'warning' | 'success';
  className?: string;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  icon,
  tooltip,
  variant = 'default',
  className,
}: KPICardProps) {
  const variantStyles = {
    default: "border-border",
    accent: "border-accent/30 bg-accent/5",
    warning: "border-warning/30 bg-warning/5",
    success: "border-success/30 bg-success/5",
  };

  const trendColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  };

  const TrendIcon = trend?.direction === 'up' 
    ? TrendingUp 
    : trend?.direction === 'down' 
    ? TrendingDown 
    : Minus;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md animate-fade-in",
      variantStyles[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {icon && (
            <div className={cn(
              "p-2 rounded-lg",
              variant === 'accent' ? "bg-accent/10 text-accent" :
              variant === 'warning' ? "bg-warning/10 text-warning" :
              variant === 'success' ? "bg-success/10 text-success" :
              "bg-primary/10 text-primary"
            )}>
              {icon}
            </div>
          )}
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </div>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground/50 cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <p className={cn(
              "text-2xl font-bold",
              variant === 'accent' ? "text-accent" :
              variant === 'warning' ? "text-warning" :
              variant === 'success' ? "text-success" :
              "text-foreground"
            )}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className={cn("flex items-center gap-1 text-sm", trendColors[trend.direction])}>
              <TrendIcon className="h-4 w-4" />
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
