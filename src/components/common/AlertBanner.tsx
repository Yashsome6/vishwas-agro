import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AlertBannerProps {
  type: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
  onDismiss?: () => void;
}

export default function AlertBanner({ 
  type, 
  title, 
  description, 
  actionLabel, 
  actionLink,
  onDismiss 
}: AlertBannerProps) {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    return type === 'error' ? 'destructive' : 'default';
  };

  return (
    <Alert variant={getVariant()} className="mb-4">
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>{description}</span>
        <div className="flex gap-2">
          {actionLabel && actionLink && (
            <Button
              size="sm"
              variant={type === 'error' ? 'default' : 'outline'}
              onClick={() => navigate(actionLink)}
            >
              {actionLabel}
            </Button>
          )}
          {onDismiss && (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
