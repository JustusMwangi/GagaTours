import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router';
import { Loader2, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

import { useResetPasswordMutation } from '@/services/auth/authApi';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    try {
      await resetPassword({
        token,
        password: data.password,
      }).unwrap();
      setIsSubmitted(true);
    } catch {
      // Error is handled by RTK Query
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if ('status' in error) {
      const data = error.data as { message?: string } | undefined;
      return data?.message || 'Failed to reset password. Please try again.';
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
            Invalid reset link
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            This password reset link is invalid or has expired.
          </p>

          <div className="mt-8 space-y-4">
            <Button
              asChild
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
            >
              <Link to="/forgot-password">Request new reset link</Link>
            </Button>
            <div>
              <Link
                to="/login"
                className="text-sm text-primary hover:brightness-110 transition-all inline-flex items-center"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  // Success state
  if (isSubmitted) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Password reset!
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Your password has been successfully reset.
          </p>

          <div className="mt-8">
            <Button
              asChild
              className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
            >
              <Link to="/login">Sign in with new password</Link>
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
            Reset your password
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {getErrorMessage() && (
            <Alert variant="destructive">
              <AlertDescription>{getErrorMessage()}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
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
            <Label htmlFor="confirmPassword">Confirm new password</Label>
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
            Reset password
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-sm text-primary hover:brightness-110 transition-all inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
