import { NavLink, useLocation } from 'react-router';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  Bell,
  FileText,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Map,
  MapPin,
  Tag,
  UserCheck,
  CalendarCheck,
  MessageSquare,
  Receipt,
  FileSpreadsheet,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePermissions, Permissions } from '@/hooks/usePermissions';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  const location = useLocation();
  const {
    hasAnyPermission,
    hasAnyRole,
    isSuperadmin,
    isLoading,
  } = usePermissions();

  const isAdmin = hasAnyRole || isSuperadmin;

  const navItems: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  ];

  // Tour domain
  if (isLoading || isAdmin || hasAnyPermission([Permissions.TOURS_VIEW])) {
    navItems.push({ title: 'Tours', href: '/tours', icon: Map });
    navItems.push({ title: 'Categories', href: '/categories', icon: Tag });
    navItems.push({ title: 'Destinations', href: '/destinations', icon: MapPin });
  }

  if (isLoading || isAdmin || hasAnyPermission([Permissions.INQUIRIES_VIEW])) {
    navItems.push({ title: 'Inquiries', href: '/inquiries', icon: MessageSquare });
  }

  if (isLoading || isAdmin || hasAnyPermission([Permissions.CUSTOMERS_VIEW])) {
    navItems.push({ title: 'Customers', href: '/customers', icon: UserCheck });
  }

  if (isLoading || isAdmin || hasAnyPermission([Permissions.BOOKINGS_VIEW])) {
    navItems.push({ title: 'Bookings', href: '/bookings', icon: CalendarCheck });
  }

  if (isLoading || isAdmin || hasAnyPermission([Permissions.QUOTATIONS_VIEW])) {
    navItems.push({ title: 'Quotations', href: '/quotations', icon: FileSpreadsheet });
  }

  if (isLoading || isAdmin || hasAnyPermission([Permissions.INVOICES_VIEW])) {
    navItems.push({ title: 'Invoices', href: '/invoices', icon: Receipt });
  }

  // System
  if (isLoading || isAdmin || hasAnyPermission([Permissions.USERS_VIEW])) {
    navItems.push({ title: 'Users', href: '/users', icon: Users });
  }

  if (isLoading || isAdmin || hasAnyPermission([Permissions.ROLES_VIEW])) {
    navItems.push({ title: 'Roles', href: '/roles', icon: Shield });
  }

  if (isAdmin || hasAnyPermission([Permissions.AUDIT_VIEW])) {
    navItems.push({ title: 'Audit Log', href: '/audit', icon: ClipboardList });
  }

  navItems.push({ title: 'Notifications', href: '/notifications', icon: Bell });

  if (isLoading || isAdmin || hasAnyPermission([Permissions.FILES_VIEW])) {
    navItems.push({ title: 'Files', href: '/files', icon: FileText });
  }

  navItems.push({ title: 'Help', href: '/help', icon: HelpCircle });

  if (isAdmin || hasAnyPermission([Permissions.SETTINGS_VIEW])) {
    navItems.push({ title: 'Settings', href: '/settings', icon: Settings });
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full bg-sidebar text-sidebar-foreground transition-all duration-300',
        collapsed ? 'w-14' : 'w-52'
      )}
    >
      {/* Brand */}
      <div className="flex h-14 items-center px-3 gap-2.5 border-b border-sidebar-border">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold font-display">
          B
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold font-display tracking-tight text-sidebar-foreground">
            Book With Sheilla
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-px">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? item.title : undefined}
            >
              <Icon className={cn(
                'h-4 w-4 shrink-0 transition-colors',
                isActive ? 'text-primary' : 'text-sidebar-foreground/40'
              )} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            'w-full h-7 text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-accent',
            collapsed && 'px-2'
          )}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <>
              <ChevronLeft className="h-3.5 w-3.5 mr-1.5" />
              Collapse
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
