// import React, { createContext, useContext, useEffect, useState } from 'react';

// interface User {
//     id: string;
//     name: string;
//     email: string;
// }

// interface AuthContextType {
//     user: User | null;
//     isAuthenticated: boolean;
//     isLoading: boolean;
//     login: (email: string, password: string) => Promise<void>;
//     register: (name: string, email: string, password: string) => Promise<void>;
//     logout: () => void;
//     updateProfile: (name: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(() => {
//         const stored = localStorage.getItem('authUser');
//         return stored ? JSON.parse(stored) : null;
//     });
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         if (user) localStorage.setItem('authUser', JSON.stringify(user));
//         else localStorage.removeItem('authUser');
//     }, [user]);

//     const fakeDelay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

//     const login = async (email: string, password: string) => {
//         setIsLoading(true);
//         try {
//             await fakeDelay(500);
//             // In this demo we don't validate passwords. If there's an existing stored user with the same
//             // email we restore it; otherwise we create a simple user object.
//             const existing = localStorage.getItem('authUser');
//             if (existing) {
//                 const parsed = JSON.parse(existing);
//                 if (parsed.email === email) {
//                     setUser(parsed);
//                     return;
//                 }
//             }
//             const newUser: User = { id: crypto.randomUUID(), name: email.split('@')[0], email };
//             setUser(newUser);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const register = async (name: string, email: string, password: string) => {
//         setIsLoading(true);
//         try {
//             await fakeDelay(500);
//             const newUser: User = { id: crypto.randomUUID(), name, email };
//             setUser(newUser);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const logout = () => {
//         setUser(null);
//     };

//     const updateProfile = async (name: string) => {
//         setIsLoading(true);
//         try {
//             await fakeDelay(300);
//             setUser((prev) => (prev ? { ...prev, name } : prev));
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 isAuthenticated: !!user,
//                 isLoading,
//                 login,
//                 register,
//                 logout,
//                 updateProfile,
//             }}
//         >
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const ctx = useContext(AuthContext);
//     if (!ctx) throw new Error('useAuth must be used within AuthProvider');
//     return ctx;
// };

// export default AuthProvider;


import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useToast } from '../hooks/use-toast';
import authService, { LoginData, RegisterData, UpdateProfileData, User } from '../services/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    // Initialize auth state on mount
    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            setIsLoading(true);

            // Check if we have tokens
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (!accessToken || !refreshToken) {
                // No tokens, user is not authenticated
                setIsLoading(false);
                return;
            }

            // Try to get stored user first (immediate UI update)
            const storedUser = authService.getStoredUser();
            if (storedUser) {
                setUser(storedUser);
            }

            // Then fetch fresh user data
            try {
                const freshUser = await authService.getProfile();
                setUser(freshUser);
            } catch (error: any) {
                console.error('Failed to fetch user profile:', error);

                // If we get a 401, the interceptor should have tried to refresh
                // If we still get here, both tokens are invalid
                if (error.response?.status === 401) {
                    // Clear everything and stay logged out
                    setUser(null);
                    authService.clearAuthData();
                } else if (storedUser) {
                    // For other errors, keep the stored user (offline-first approach)
                    setUser(storedUser);
                }
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginData) => {
        try {
            setIsLoading(true);
            const authData = await authService.login(data);
            setUser(authData.user);

            toast({
                title: 'Success',
                description: 'Logged in successfully!',
            });
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to login';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
            const authData = await authService.register(data);
            setUser(authData.user);

            toast({
                title: 'Success',
                description: 'Account created successfully!',
            });
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to register';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await authService.logout();
            setUser(null);

            toast({
                title: 'Success',
                description: 'Logged out successfully!',
            });
        } catch (error: any) {
            console.error('Logout error:', error);
            // Clear user even if logout request fails
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (data: UpdateProfileData) => {
        try {
            setIsLoading(true);
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);

            toast({
                title: 'Success',
                description: 'Profile updated successfully!',
            });
        } catch (error: any) {
            const message = error.response?.data?.error || 'Failed to update profile';
            toast({
                title: 'Error',
                description: message,
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const refreshUserProfile = async () => {
        try {
            const freshUser = await authService.getProfile();
            setUser(freshUser);
        } catch (error) {
            console.error('Failed to refresh user profile:', error);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        refreshUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};