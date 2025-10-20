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
    ArrowLeft,
    LayoutGrid,
    List,
    LogOut,
    Plus,
    Sparkles,
    User
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TaskBoardHeaderProps {
    projectName: string;
    projectDescription?: string;
    viewMode: 'kanban' | 'list';
    onViewModeChange: (mode: 'kanban' | 'list') => void;
    onAddTask: () => void;
}

export const TaskBoardHeader = ({
    projectName,
    projectDescription,
    viewMode,
    onViewModeChange,
    onAddTask,
}: TaskBoardHeaderProps) => {
    const { user, logout } = useAuth();
    const [profileDialogOpen, setProfileDialogOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
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
            <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex h-16 items-center justify-between gap-4">
                        {/* Left Section: Logo + Back + Project Info */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                            {/* Back Button */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate('/')}
                                className="flex-shrink-0"
                                title="Back to Projects"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>

                            {/* Logo */}
                            <div
                                className="hidden sm:flex items-center gap-2 cursor-pointer flex-shrink-0"
                                onClick={() => navigate('/')}
                            >
                                <div className="p-1.5 bg-primary/10 rounded-lg">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-semibold text-base">Task Mate</span>
                            </div>

                            {/* Divider */}
                            <div className="hidden sm:block h-6 w-px bg-border flex-shrink-0" />

                            {/* Project Info */}
                            <div className="min-w-0 flex-1">
                                <h1 className="text-base font-semibold text-foreground truncate">
                                    {projectName}
                                </h1>
                                {projectDescription && (
                                    <p className="text-xs text-muted-foreground truncate hidden md:block">
                                        {projectDescription}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Right Section: View Toggle + Add Task + User Menu */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            {/* View Toggle */}
                            <div className="hidden sm:flex bg-muted rounded-lg p-1">
                                <Button
                                    variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => onViewModeChange('kanban')}
                                    className="gap-1.5 h-8 text-xs"
                                    title="Kanban View"
                                >
                                    <LayoutGrid className="h-3.5 w-3.5" />
                                    <span className="hidden lg:inline">Kanban</span>
                                </Button>
                                <Button
                                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                    size="sm"
                                    onClick={() => onViewModeChange('list')}
                                    className="gap-1.5 h-8 text-xs"
                                    title="List View"
                                >
                                    <List className="h-3.5 w-3.5" />
                                    <span className="hidden lg:inline">List</span>
                                </Button>
                            </div>

                            {/* Add Task Button */}
                            <Button onClick={onAddTask} size="sm" className="gap-1.5 h-9">
                                <Plus className="h-4 w-4" />
                                <span className="hidden sm:inline">New Task</span>
                            </Button>

                            {/* User Dropdown Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
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
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Mobile View Toggle - Below header on small screens */}
                    <div className="sm:hidden flex justify-center pb-3 border-t border-border mt-0 pt-3">
                        <div className="flex bg-muted rounded-lg p-1 w-full max-w-xs">
                            <Button
                                variant={viewMode === 'kanban' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => onViewModeChange('kanban')}
                                className="gap-2 flex-1"
                            >
                                <LayoutGrid className="h-4 w-4" />
                                Kanban
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                                size="sm"
                                onClick={() => onViewModeChange('list')}
                                className="gap-2 flex-1"
                            >
                                <List className="h-4 w-4" />
                                List
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Profile Dialog */}
            <ProfileDialog
                open={profileDialogOpen}
                onOpenChange={setProfileDialogOpen}
            />
        </>
    );
};
