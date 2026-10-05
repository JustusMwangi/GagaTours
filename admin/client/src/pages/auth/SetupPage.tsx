import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

import { useBootstrapMutation, useCheckBootstrapQuery } from '@/services/auth/authApi';
import { setCredentials, setLoading } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';

import AuthLayout from '@/components/auth/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

const setupSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name must be less than 255 characters'),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must be less than 255 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type SetupFormData = z.infer<typeof setupSchema>;

export default function SetupPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [bootstrap, { isLoading, error }] = useBootstrapMutation();
  const { data: bootstrapCheck, isLoading: checkLoading } = useCheckBootstrapQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupFormData>({
    resolver: zodResolver(setupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Redirect to login if system is already bootstrapped
  if (checkLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (bootstrapCheck && !bootstrapCheck.needs_bootstrap) {
    navigate('/login', { replace: true });
    return null;
  }

  const onSubmit = async (data: SetupFormData) => {
    try {
      dispatch(setLoading(true));
      const result = await bootstrap({
        email: data.email,
        password: data.password,
        first_name: data.first_name,
        last_name: data.last_name,
      }).unwrap();

      dispatch(setCredentials({
        user: result.user,
        accessToken: result.access_token,
        refreshToken: result.refresh_token,
      }));

      dispatch(setLoading(false));
      navigate('/dashboard', { replace: true });
    } catch {
      dispatch(setLoading(false));
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if ('status' in error) {
      const data = error.data as { message?: string } | undefined;
      return data?.message || 'Setup failed. Please try again.';
    }
    return 'An unexpected error occurred.';
  };

  return (
    <AuthLayout>
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Setting up your account...</p>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Get started with your free account. Your business profile will be
          created automatically.
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
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Your email address"
            autoComplete="email"
            className="h-11 rounded-lg"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
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
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
