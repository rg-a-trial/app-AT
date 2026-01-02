import { ReactNode } from "react";
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AlertBannerProps {
  title: string;
  description?: string;
  variant?: 'info' | 'warning' | 'success' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
  className?: string;
}

export function AlertBanner({
  title,
  description,
  variant = 'info',
  action,
  onDismiss,
  className,
}: AlertBannerProps) {
  const variants = {
    info: {
      bg: "bg-info/10 border-info/30",
      icon: Info,
      iconColor: "text-info",
    },
    warning: {
      bg: "bg-warning/10 border-warning/30",
      icon: AlertTriangle,
      iconColor: "text-warning",
    },
    success: {
      bg: "bg-success/10 border-success/30",
      icon: CheckCircle,
      iconColor: "text-success",
    },
    error: {
      bg: "bg-destructive/10 border-destructive/30",
      icon: XCircle,
      iconColor: "text-destructive",
    },
  };

  const { bg, icon: Icon, iconColor } = variants[variant];

  return (
    <div className={cn(
      "flex items-start gap-4 p-4 rounded-lg border animate-fade-in",
      bg,
      className
    )}>
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {action && (
          <Button 
            size="sm" 
            variant={variant === 'warning' ? 'default' : 'outline'}
            onClick={action.onClick}
            className={variant === 'warning' ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}
          >
            {action.label}
          </Button>
        )}
        {onDismiss && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onDismiss}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
