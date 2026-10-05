import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useCheckBootstrapQuery } from '@/services/auth/authApi';
import { useAppSelector } from '@/store/hooks';
import { Loader2 } from 'lucide-react';

interface BootstrapCheckerProps {
  children: React.ReactNode;
}

export default function BootstrapChecker({ children }: BootstrapCheckerProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken } = useAppSelector((state) => state.auth);

  // Skip bootstrap check if user is already authenticated
  const { data, isLoading, error } = useCheckBootstrapQuery(undefined, {
    skip: !!accessToken,
  });

  useEffect(() => {
    if (data?.needs_bootstrap && location.pathname !== '/setup' && !accessToken) {
      navigate('/setup', { replace: true });
    }
  }, [data, location.pathname, navigate, accessToken]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return <>{children}</>;
  }

  if (data?.needs_bootstrap && location.pathname !== '/setup' && !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <>{children}</>;
}
