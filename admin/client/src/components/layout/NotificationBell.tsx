import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useGetUnreadCountQuery } from '@/services/notifications/notificationsApi';
import { Button } from '@/components/ui/button';

export function NotificationBell() {
  const { data: unreadCount } = useGetUnreadCountQuery(undefined, {
    pollingInterval: 30000,
  });
  const navigate = useNavigate();

  const displayCount = unreadCount && unreadCount > 9 ? '9+' : unreadCount;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate('/notifications')}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      {unreadCount != null && unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-white animate-pulse">
          {displayCount}
        </span>
      )}
    </Button>
  );
}
