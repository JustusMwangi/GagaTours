import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';

import { useVerifyEmailMutation } from '@/services/auth/authApi';

import { Button } from '@/components/ui/button';
import AuthLayout from '@/components/auth/AuthLayout';

type VerificationStatus = 'loading' | 'success' | 'error' | 'no-token';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<VerificationStatus>(token ? 'loading' : 'no-token');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await verifyEmail({ token }).unwrap();
        setStatus('success');
      } catch (err) {
        setStatus('error');
        if (err && typeof err === 'object' && 'data' in err) {
          const data = (err as { data?: { message?: string } }).data;
          setErrorMessage(data?.message || 'Verification failed');
        } else {
          setErrorMessage('An unexpected error occurred');
        }
      }
    };

    verify();
  }, [token, verifyEmail]);

  if (status === 'loading') {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Verifying your email...
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Please wait while we verify your email address.
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (status === 'success') {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Email verified!
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Your email address has been successfully verified.
          </p>

          <div className="mt-8">
            <Button
              asChild
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
            >
              <Link to="/login">Continue to sign in</Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Error or no-token state
  return (
    <AuthLayout>
      <div className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-7 w-7 text-destructive" />
        </div>
        <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
          {status === 'no-token' ? 'Invalid verification link' : 'Verification failed'}
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          {status === 'no-token'
            ? 'This verification link is invalid or missing.'
            : errorMessage || 'The verification link may have expired.'}
        </p>

        <div className="mt-8 space-y-4">
          <Button
            asChild
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
          >
            <Link to="/login">Go to sign in</Link>
          </Button>
          <p className="text-sm text-muted-foreground">
            Need a new verification email? Sign in and request one from your profile.
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
