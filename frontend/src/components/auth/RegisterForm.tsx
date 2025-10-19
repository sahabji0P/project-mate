// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';
// import { Loader2, Lock, Mail, User } from 'lucide-react';
// import { useState } from 'react';

// interface RegisterFormProps {
//   onSwitchToLogin: () => void;
//   onSuccess?: () => void;
// }

// export const RegisterForm = ({ onSwitchToLogin, onSuccess }: RegisterFormProps) => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const { register } = useAuth();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast({
//         title: 'Password mismatch',
//         description: 'Passwords do not match. Please try again.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     if (password.length < 6) {
//       toast({
//         title: 'Password too short',
//         description: 'Password must be at least 6 characters long.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await register(name, email, password);
//       toast({
//         title: 'Welcome!',
//         description: 'Your account has been created successfully.',
//       });
//       onSuccess?.();
//     } catch (error) {
//       toast({
//         title: 'Registration failed',
//         description: error instanceof Error ? error.message : 'Please try again.',
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const isFormValid = name && email && password && confirmPassword && password === confirmPassword;

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="space-y-2">
//         <Label htmlFor="name">Full Name</Label>
//         <div className="relative">
//           <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             id="name"
//             type="text"
//             placeholder="Enter your full name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="pl-10"
//             required
//             disabled={isLoading}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="email">Email</Label>
//         <div className="relative">
//           <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             id="email"
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="pl-10"
//             required
//             disabled={isLoading}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="password">Password</Label>
//         <div className="relative">
//           <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             id="password"
//             type="password"
//             placeholder="Create a password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="pl-10"
//             required
//             disabled={isLoading}
//             minLength={6}
//           />
//         </div>
//       </div>

//       <div className="space-y-2">
//         <Label htmlFor="confirmPassword">Confirm Password</Label>
//         <div className="relative">
//           <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input
//             id="confirmPassword"
//             type="password"
//             placeholder="Confirm your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             className="pl-10"
//             required
//             disabled={isLoading}
//           />
//         </div>
//         {password && confirmPassword && password !== confirmPassword && (
//           <p className="text-sm text-destructive">Passwords do not match</p>
//         )}
//       </div>

//       <Button
//         type="submit"
//         className="w-full"
//         disabled={isLoading || !isFormValid}
//       >
//         {isLoading ? (
//           <>
//             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//             Creating account...
//           </>
//         ) : (
//           'Create Account'
//         )}
//       </Button>

//       <div className="text-center text-sm">
//         <span className="text-muted-foreground">Already have an account? </span>
//         <button
//           type="button"
//           onClick={onSwitchToLogin}
//           className="text-primary hover:underline font-medium"
//           disabled={isLoading}
//         >
//           Sign in
//         </button>
//       </div>
//     </form>
//   );
// };


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });
      navigate('/'); // Redirect to home page after successful registration
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your information to get started
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 6 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Register'}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};