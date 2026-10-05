import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useGetDashboardQuery, useGetAppSettingsQuery } from '@/services/settings/settingsApi';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Bell,
  FileText,
  Settings,
  Shield,
  Users,
  UserPlus,
  Upload,
} from 'lucide-react';
import { useNavigate } from 'react-router';

const shortcuts = [
  { label: 'Manage users', href: '/users', icon: Users },
  { label: 'Invite someone', href: '/users', icon: UserPlus },
  { label: 'Roles & permissions', href: '/roles', icon: Shield },
  { label: 'Upload a file', href: '/files', icon: Upload },
  { label: 'Audit log', href: '/audit', icon: FileText },
  { label: 'App settings', href: '/settings', icon: Settings },
];

export default function DashboardPage() {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();
  const { data: dashboard, isLoading } = useGetDashboardQuery();
  const { data: appSettings } = useGetAppSettingsQuery();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="animate-in-view flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            {greeting}, {user?.first_name}.
          </h1>
          <p className="text-muted-foreground mt-1">{today}</p>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          {appSettings?.app_name ?? 'Loading…'}
        </span>
      </div>

      {/* Two-column layout */}
      <div className="animate-in-view stagger-2 grid gap-6 lg:grid-cols-5">

        {/* Left — stats + shortcuts */}
        <div className="lg:col-span-3 space-y-6">

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => navigate('/users')}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 text-left transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="rounded-md bg-[#0f766e]/8 p-1.5 group-hover:bg-[#0f766e]/15 transition-colors">
                <Users className="h-3.5 w-3.5 text-[#0f766e]" />
              </div>
              <div className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-5 w-8 rounded" />
                ) : (
                  <p className="font-display text-lg font-bold tracking-tight leading-none">
                    {dashboard?.user_count ?? 0}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5 truncate">members</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/notifications')}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 text-left transition-all hover:border-primary/30 hover:shadow-sm"
            >
              <div className="rounded-md bg-[#7c3aed]/8 p-1.5 group-hover:bg-[#7c3aed]/15 transition-colors">
                <Bell className="h-3.5 w-3.5 text-[#7c3aed]" />
              </div>
              <div className="min-w-0">
                {isLoading ? (
                  <Skeleton className="h-5 w-8 rounded" />
                ) : (
                  <p className="font-display text-lg font-bold tracking-tight leading-none">
                    {dashboard?.unread_notifications ?? 0}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5 truncate">unread</p>
              </div>
            </button>
          </div>

          {/* Quick actions */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Quick actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {shortcuts.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.href)}
                    className="group flex items-center gap-2.5 rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground transition-all hover:border-primary/30 hover:bg-accent"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right — activity feed */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Recent activity
              </h2>
            </div>

            <div className="px-5 py-2">
              {isLoading ? (
                <div className="space-y-3 py-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-3/4 rounded" />
                      <Skeleton className="h-3 w-12 rounded" />
                    </div>
                  ))}
                </div>
              ) : dashboard?.recent_activity && dashboard.recent_activity.length > 0 ? (
                <div className="divide-y divide-border/60">
                  {dashboard.recent_activity.map((item) => (
                    <div key={item.id} className="flex items-start justify-between gap-3 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.action}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {item.user_email}
                        </p>
                      </div>
                      {item.created_at && (
                        <time className="text-[11px] text-muted-foreground whitespace-nowrap tabular-nums mt-0.5">
                          {new Date(item.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No activity yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
