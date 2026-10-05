import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import { usePermissions, Permissions } from '@/hooks/usePermissions';
import {
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
} from '@/services/settings/settingsApi';

import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const updateAppSettingsSchema = z.object({
  app_name: z.string().min(1, 'Application name is required').max(255),
});

type UpdateAppSettingsFormData = z.infer<typeof updateAppSettingsSchema>;

const regionalSettingsSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  currency: z.string().min(1, 'Currency is required'),
  locale: z.string().min(1, 'Locale is required'),
  date_format: z.enum(['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']),
  time_format: z.enum(['12h', '24h']),
});

type RegionalSettingsFormData = z.infer<typeof regionalSettingsSchema>;

const businessSettingsSchema = z.object({
  business_name: z.string().max(255).optional(),
  business_address: z.string().max(500).optional(),
  business_phone: z.string().max(50).optional(),
  business_email: z.string().email('Invalid email').max(255).optional().or(z.literal('')),
});

type BusinessSettingsFormData = z.infer<typeof businessSettingsSchema>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIMEZONES = [
  'Africa/Nairobi',
  'Africa/Lagos',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'UTC',
];

const CURRENCIES = [
  { value: 'KES', label: 'KES - Kenyan Shilling' },
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
];

const LOCALES = [
  { value: 'en-KE', label: 'English (Kenya)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'sw-KE', label: 'Swahili (Kenya)' },
];

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
];

// ---------------------------------------------------------------------------
// General Tab
// ---------------------------------------------------------------------------

function GeneralTab({ canEdit }: { canEdit: boolean }) {
  const { data: settings, isLoading } = useGetAppSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAppSettingsMutation();

  const form = useForm<UpdateAppSettingsFormData>({
    resolver: zodResolver(updateAppSettingsSchema),
    defaultValues: { app_name: '' },
  });

  useEffect(() => {
    if (settings) {
      form.reset({ app_name: settings.app_name });
    }
  }, [settings, form]);

  const onSubmit = async (data: UpdateAppSettingsFormData) => {
    try {
      await updateSettings(data).unwrap();
      toast.success('Application settings updated successfully');
    } catch {
      toast.error('Failed to update application settings');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-9 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>Manage your application name and identity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="app-name">Application Name</Label>
            <Input
              id="app-name"
              disabled={!canEdit}
              {...form.register('app_name')}
            />
            {form.formState.errors.app_name && (
              <p className="text-sm text-destructive">{form.formState.errors.app_name.message}</p>
            )}
          </div>

          {canEdit && (
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Regional Tab
// ---------------------------------------------------------------------------

function RegionalTab({ canEdit }: { canEdit: boolean }) {
  const { data: settings, isLoading } = useGetAppSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAppSettingsMutation();

  const form = useForm<RegionalSettingsFormData>({
    resolver: zodResolver(regionalSettingsSchema),
    defaultValues: {
      timezone: 'Africa/Nairobi',
      currency: 'KES',
      locale: 'en-KE',
      date_format: 'DD/MM/YYYY',
      time_format: '24h',
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        timezone: settings.timezone,
        currency: settings.currency,
        locale: settings.locale,
        date_format: settings.date_format,
        time_format: settings.time_format,
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: RegionalSettingsFormData) => {
    try {
      await updateSettings(data).unwrap();
      toast.success('Regional settings updated');
    } catch {
      toast.error('Failed to update regional settings');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regional Settings</CardTitle>
        <CardDescription>Configure timezone, currency, and display formats</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select
                value={form.watch('timezone')}
                onValueChange={(v) => form.setValue('timezone', v, { shouldDirty: true })}
                disabled={!canEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Currency</Label>
              <Select
                value={form.watch('currency')}
                onValueChange={(v) => form.setValue('currency', v, { shouldDirty: true })}
                disabled={!canEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Locale</Label>
              <Select
                value={form.watch('locale')}
                onValueChange={(v) => form.setValue('locale', v, { shouldDirty: true })}
                disabled={!canEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select locale" />
                </SelectTrigger>
                <SelectContent>
                  {LOCALES.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select
                value={form.watch('date_format')}
                onValueChange={(v) =>
                  form.setValue('date_format', v as RegionalSettingsFormData['date_format'], {
                    shouldDirty: true,
                  })
                }
                disabled={!canEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FORMATS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Format</Label>
              <Select
                value={form.watch('time_format')}
                onValueChange={(v) =>
                  form.setValue('time_format', v as '12h' | '24h', { shouldDirty: true })
                }
                disabled={!canEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12-hour</SelectItem>
                  <SelectItem value="24h">24-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {canEdit && (
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Regional Settings
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Business Tab
// ---------------------------------------------------------------------------

function BusinessTab({ canEdit }: { canEdit: boolean }) {
  const { data: settings, isLoading } = useGetAppSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAppSettingsMutation();

  const form = useForm<BusinessSettingsFormData>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      business_name: '',
      business_address: '',
      business_phone: '',
      business_email: '',
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        business_name: settings.business_name ?? '',
        business_address: settings.business_address ?? '',
        business_phone: settings.business_phone ?? '',
        business_email: settings.business_email ?? '',
      });
    }
  }, [settings, form]);

  const onSubmit = async (data: BusinessSettingsFormData) => {
    try {
      await updateSettings({
        business_name: data.business_name || null,
        business_address: data.business_address || null,
        business_phone: data.business_phone || null,
        business_email: data.business_email || null,
      }).unwrap();
      toast.success('Business info updated');
    } catch {
      toast.error('Failed to update business info');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-64 mt-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>Details used on invoices and official communications</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="biz-name">Business Name</Label>
            <Input
              id="biz-name"
              placeholder="Registered business name"
              disabled={!canEdit}
              {...form.register('business_name')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="biz-address">Address</Label>
            <Textarea
              id="biz-address"
              placeholder="Street address, city, country"
              disabled={!canEdit}
              {...form.register('business_address')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="biz-phone">Phone</Label>
              <Input
                id="biz-phone"
                placeholder="+254 7XX XXX XXX"
                disabled={!canEdit}
                {...form.register('business_phone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="biz-email">Email</Label>
              <Input
                id="biz-email"
                type="email"
                placeholder="billing@example.com"
                disabled={!canEdit}
                {...form.register('business_email')}
              />
              {form.formState.errors.business_email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.business_email.message}
                </p>
              )}
            </div>
          </div>

          {canEdit && (
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Business Info
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Main Settings Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const { hasPermission } = usePermissions();

  const canView = hasPermission(Permissions.SETTINGS_VIEW);
  const canEdit = hasPermission(Permissions.SETTINGS_EDIT);

  if (!canView) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Manage your application settings" />
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              You do not have permission to view settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your application settings" />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="regional">Regional</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4">
          <GeneralTab canEdit={canEdit} />
        </TabsContent>

        <TabsContent value="regional" className="mt-4">
          <RegionalTab canEdit={canEdit} />
        </TabsContent>

        <TabsContent value="business" className="mt-4">
          <BusinessTab canEdit={canEdit} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
