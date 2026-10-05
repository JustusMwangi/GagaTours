import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

import { useLoginMutation } from '@/services/auth/authApi';
import { setCredentials } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/components/auth/AuthLayout';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading, error: loginError }] = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login({
        email: data.email,
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
    if (!loginError) return null;
    if ('status' in loginError) {
      const data = loginError.data as { message?: string } | undefined;
      return data?.message || 'Login failed. Please try again.';
    }
    return 'An unexpected error occurred.';
  };

  return (
    <AuthLayout>
      <div>
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Welcome back
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in to your account to continue
          </p>
        </div>

        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {getErrorMessage() && (
              <Alert variant="destructive">
                <AlertDescription>{getErrorMessage()}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                autoComplete="email"
                autoFocus
                className="h-11 rounded-lg"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:brightness-110 transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-11 rounded-lg"
                {...form.register('password')}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Need an account? Contact your administrator for an invite.
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
