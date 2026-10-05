import { useNavigate } from 'react-router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectCurrentUser,
  logout,
} from '@/features/auth/authSlice';
import { useLogoutMutation } from '@/services/auth/authApi';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function UserMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const [logoutMutation, { isLoading }] = useLogoutMutation();

  const displayName = user ? `${user.first_name} ${user.last_name}`.trim() : '';

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Logout locally even if API call fails
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.[0] ?? '';
    const last = lastName?.[0] ?? '';
    return (first + last).toUpperCase() || 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-teal-600 to-teal-700 text-white text-sm font-medium">
              {getInitials(user?.first_name, user?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start text-sm">
            <span className="font-medium">{displayName}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-1">
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')} className="px-3 py-2 cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/settings')} className="px-3 py-2 cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoading}
          className="px-3 py-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
