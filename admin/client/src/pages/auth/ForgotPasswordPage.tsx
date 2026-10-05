import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

import { useForgotPasswordMutation } from '@/services/auth/authApi';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [forgotPassword, { isLoading, error }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data).unwrap();
      setIsSubmitted(true);
    } catch {
      // Error is handled by RTK Query
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if ('status' in error) {
      const data = error.data as { message?: string } | undefined;
      return data?.message || 'Failed to send reset email. Please try again.';
    }
    return 'An unexpected error occurred.';
  };

  if (isSubmitted) {
    return (
      <AuthLayout>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-7 w-7 text-primary" />
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent a password reset link to{' '}
            <span className="font-medium text-foreground">{getValues('email')}</span>
          </p>

          <div className="mt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button
              variant="outline"
              className="w-full h-11 rounded-lg"
              onClick={() => setIsSubmitted(false)}
            >
              Try another email
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

  return (
    <AuthLayout>
      <div>
        <div className="mb-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Forgot password?
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              className="h-11 rounded-lg"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground hover:brightness-110 transition-all"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send reset link
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
