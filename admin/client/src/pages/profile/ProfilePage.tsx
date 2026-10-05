import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { useGetProfileQuery, useUpdateProfileMutation } from '@/services/users/usersApi';

const personalInfoSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
});

type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  // Personal info form
  const personalForm = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    values: profile
      ? {
          first_name: profile.first_name,
          last_name: profile.last_name,
        }
      : undefined,
  });

  // Password form
  const passwordForm = useForm<{
    current_password: string;
    new_password: string;
    confirm_password: string;
  }>({
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const handleUpdatePersonalInfo = async (values: PersonalInfoFormValues) => {
    try {
      await updateProfile({
        first_name: values.first_name,
        last_name: values.last_name,
      }).unwrap();
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (values: {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    if (values.new_password !== values.confirm_password) {
      passwordForm.setError('confirm_password', { message: 'Passwords do not match' });
      return;
    }
    if (values.new_password.length < 8) {
      passwordForm.setError('new_password', { message: 'Password must be at least 8 characters' });
      return;
    }
    try {
      await updateProfile({
        current_password: values.current_password,
        new_password: values.new_password,
      }).unwrap();
      toast.success('Password changed successfully');
      passwordForm.reset();
    } catch {
      toast.error('Failed to change password. Please verify your current password.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and security settings."
      />

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your name and personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={personalForm.handleSubmit(handleUpdatePersonalInfo)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profile-first-name">First Name</Label>
                <Input
                  id="profile-first-name"
                  {...personalForm.register('first_name')}
                  aria-invalid={!!personalForm.formState.errors.first_name}
                />
                {personalForm.formState.errors.first_name && (
                  <p className="text-sm text-destructive">
                    {personalForm.formState.errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-last-name">Last Name</Label>
                <Input
                  id="profile-last-name"
                  {...personalForm.register('last_name')}
                  aria-invalid={!!personalForm.formState.errors.last_name}
                />
                {personalForm.formState.errors.last_name && (
                  <p className="text-sm text-destructive">
                    {personalForm.formState.errors.last_name.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile?.email ?? ''} disabled />
              <p className="text-xs text-muted-foreground">
                Email address cannot be changed.
              </p>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={personalForm.formState.isSubmitting || !personalForm.formState.isDirty}
              >
                {personalForm.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <PasswordInput
                id="current-password"
                {...passwordForm.register('current_password', {
                  required: 'Current password is required',
                })}
                aria-invalid={!!passwordForm.formState.errors.current_password}
              />
              {passwordForm.formState.errors.current_password && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.current_password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <PasswordInput
                id="new-password"
                {...passwordForm.register('new_password', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                })}
                aria-invalid={!!passwordForm.formState.errors.new_password}
              />
              {passwordForm.formState.errors.new_password && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.new_password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <PasswordInput
                id="confirm-password"
                {...passwordForm.register('confirm_password', {
                  required: 'Please confirm your new password',
                })}
                aria-invalid={!!passwordForm.formState.errors.confirm_password}
              />
              {passwordForm.formState.errors.confirm_password && (
                <p className="text-sm text-destructive">
                  {passwordForm.formState.errors.confirm_password.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={passwordForm.formState.isSubmitting}
              >
                {passwordForm.formState.isSubmitting ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
