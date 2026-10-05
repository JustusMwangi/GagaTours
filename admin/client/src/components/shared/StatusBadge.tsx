import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

function getVariantForStatus(status: string): {
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
} {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'active':
    case 'completed':
    case 'success':
      return {
        variant: 'default',
        className: 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-500/30',
      };
    case 'pending':
    case 'trial':
      return {
        variant: 'default',
        className: 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:ring-yellow-500/30',
      };
    case 'suspended':
    case 'failed':
      return {
        variant: 'default',
        className: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20 hover:bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-500/30',
      };
    case 'canceled':
    case 'inactive':
      return {
        variant: 'default',
        className: 'bg-muted text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted',
      };
    default:
      return {
        variant: 'default',
        className: 'bg-muted/50 text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted/50',
      };
  }
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { variant, className: variantClassName } = getVariantForStatus(status);

  return (
    <Badge
      variant={variant}
      className={cn(variantClassName, className)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
