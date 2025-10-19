import { AuthDialog } from '@/components/auth/AuthDialog';
import { ProfileDialog } from '@/components/layout/ProfileDialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  LogOut,
  Settings,
  Sparkles,
  User
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    setProfileDialogOpen(true);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-6">
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate('/')}
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold text-lg">TaskMate</span>
              </div>

              <nav className="hidden md:flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user ? getInitials(user.name) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user?.name}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleProfileClick}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setAuthDialogOpen(true)}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => setAuthDialogOpen(true)}
                    size="sm"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Dialogs */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultMode="login"
      />

      {isAuthenticated && (
        <ProfileDialog
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
        />
      )}
    </>
  );
};
