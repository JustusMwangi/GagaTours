import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/shared/PageHeader';

import {
  useGetPreferencesQuery,
  useUpdatePreferencesMutation,
} from '@/services/notifications/notificationsApi';
import type {
  NotificationCategory,
  NotificationPreference,
} from '@/types/notification';

const CATEGORIES: { value: NotificationCategory; label: string; description: string }[] = [
  { value: 'system', label: 'System', description: 'Platform updates, maintenance, and system alerts' },
  { value: 'security', label: 'Security', description: 'Login attempts, password changes, and security alerts' },
  { value: 'billing', label: 'Billing', description: 'Invoices, payment confirmations, and subscription changes' },
  { value: 'team', label: 'Team', description: 'Team invitations, role changes, and member updates' },
  { value: 'activity', label: 'Activity', description: 'Resource updates, changes, and task assignments' },
];

const CHANNELS = [
  { key: 'in_app_enabled' as const, label: 'In-App' },
  { key: 'email_enabled' as const, label: 'Email' },
  { key: 'push_enabled' as const, label: 'Push' },
];

type PreferenceMap = Record<NotificationCategory, NotificationPreference>;

function buildPreferenceMap(preferences: NotificationPreference[]): PreferenceMap {
  const map = {} as PreferenceMap;
  for (const pref of preferences) {
    map[pref.category] = { ...pref };
  }
  // Ensure all categories have an entry
  for (const cat of CATEGORIES) {
    if (!map[cat.value]) {
      map[cat.value] = {
        category: cat.value,
        email_enabled: true,
        in_app_enabled: true,
        push_enabled: true,
      };
    }
  }
  return map;
}

function PreferencesGridSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b last:border-b-0">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="flex items-center gap-8">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-5 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function NotificationPreferencesPage() {
  const { data: preferences, isLoading } = useGetPreferencesQuery();
  const [updatePreferences, { isLoading: isSaving }] = useUpdatePreferencesMutation();

  const [localPrefs, setLocalPrefs] = useState<PreferenceMap | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Sync local state when server data arrives/changes.
  // This is intentional: we need local mutable state for the toggle UI,
  // initialized from server data.
  useEffect(() => {
    if (preferences) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalPrefs(buildPreferenceMap(preferences));
      setIsDirty(false);
    }
  }, [preferences]);

  const handleToggle = (
    category: NotificationCategory,
    channel: 'in_app_enabled' | 'email_enabled' | 'push_enabled',
    checked: boolean,
  ) => {
    if (!localPrefs) return;
    setLocalPrefs({
      ...localPrefs,
      [category]: {
        ...localPrefs[category],
        [channel]: checked,
      },
    });
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!localPrefs) return;
    try {
      await updatePreferences({
        preferences: Object.values(localPrefs).map((pref) => ({
          category: pref.category,
          email_enabled: pref.email_enabled,
          in_app_enabled: pref.in_app_enabled,
          push_enabled: pref.push_enabled,
        })),
      }).unwrap();
      toast.success('Notification preferences saved');
      setIsDirty(false);
    } catch {
      toast.error('Failed to save notification preferences');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notification Preferences"
        description="Choose how you receive notifications"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Channels</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading || !localPrefs ? (
            <PreferencesGridSkeleton />
          ) : (
            <>
              {/* Column Headers */}
              <div className="flex items-center justify-between pb-3 border-b mb-1">
                <span className="text-sm font-medium text-muted-foreground">Category</span>
                <div className="flex items-center gap-8">
                  {CHANNELS.map((ch) => (
                    <span
                      key={ch.key}
                      className="text-sm font-medium text-muted-foreground w-12 text-center"
                    >
                      {ch.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rows */}
              <div className="divide-y">
                {CATEGORIES.map((cat) => {
                  const pref = localPrefs[cat.value];
                  return (
                    <div
                      key={cat.value}
                      className="flex items-center justify-between py-4"
                    >
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium">{cat.label}</p>
                        <p className="text-xs text-muted-foreground">{cat.description}</p>
                      </div>
                      <div className="flex items-center gap-8">
                        {CHANNELS.map((ch) => (
                          <div key={ch.key} className="flex justify-center w-12">
                            <Switch
                              id={`${cat.value}-${ch.key}`}
                              checked={pref[ch.key]}
                              onCheckedChange={(checked: boolean) =>
                                handleToggle(cat.value, ch.key, checked)
                              }
                            />
                            <Label
                              htmlFor={`${cat.value}-${ch.key}`}
                              className="sr-only"
                            >
                              {cat.label} {ch.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving || !isDirty}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  );
}
