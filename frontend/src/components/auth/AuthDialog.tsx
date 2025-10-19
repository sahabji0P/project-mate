import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'register';
}

export const AuthDialog = ({ open, onOpenChange, defaultMode = 'login' }: AuthDialogProps) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login' 
              ? 'Sign in to your account to continue managing your tasks.'
              : 'Create a new account to start organizing your projects and tasks.'
            }
          </DialogDescription>
        </DialogHeader>
        
        {mode === 'login' ? (
          <LoginForm 
            onSwitchToRegister={switchMode}
            onSuccess={handleSuccess}
          />
        ) : (
          <RegisterForm 
            onSwitchToLogin={switchMode}
            onSuccess={handleSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
