import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Loader2, AlertTriangle } from 'lucide-react';

import { useAcceptInviteMutation } from '@/services/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';
import { acceptInviteSchema, type AcceptInviteFormData } from '@/lib/validations/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/components/auth/AuthLayout';

export default function AcceptInvitePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [acceptInvite, { isLoading, error }] = useAcceptInviteMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteFormData>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: AcceptInviteFormData) => {
    if (!token) return;

    try {
      const result = await acceptInvite({
        token,
        first_name: data.first_name,
        last_name: data.last_name,
        password: data.password,
      }).unwrap();
      dispatch(setCredentials({
        user: result.user,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      }));

      navigate('/dashboard');
    } catch {
      // Error is handled by RTK Query
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if ('status' in error) {
      const data = error.data as { message?: string } | undefined;
      return data?.message || 'Failed to accept invitation. Please try again.';
    }
    return 'An unexpected error occurred.';
  };

  // No token provided
  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Invalid invitation link
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            This invitation link is invalid or has expired.
          </p>

          <div className="mt-8">
            <Button
              asChild
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
            >
              <Link to="/login">Go to sign in</Link>
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div>
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Accept invitation
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Complete your profile to join the organization
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {getErrorMessage() && (
            <Alert variant="destructive">
              <AlertDescription>{getErrorMessage()}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First name</Label>
              <Input
                id="first_name"
                placeholder="First name"
                autoComplete="given-name"
                className="h-11 rounded-lg"
                {...register('first_name')}
              />
              {errors.first_name && (
                <p className="text-sm text-destructive">{errors.first_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last name</Label>
              <Input
                id="last_name"
                placeholder="Last name"
                autoComplete="family-name"
                className="h-11 rounded-lg"
                {...register('last_name')}
              />
              {errors.last_name && (
                <p className="text-sm text-destructive">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
              className="h-11 rounded-lg"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className="h-11 rounded-lg"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Accept invitation
          </Button>
        </form>

        <div className="mt-8 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:brightness-110 transition-all">
            Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
