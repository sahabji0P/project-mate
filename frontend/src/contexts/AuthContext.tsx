import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateProfile: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('authUser');
        return stored ? JSON.parse(stored) : null;
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) localStorage.setItem('authUser', JSON.stringify(user));
        else localStorage.removeItem('authUser');
    }, [user]);

    const fakeDelay = (ms = 500) => new Promise((res) => setTimeout(res, ms));

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            await fakeDelay(500);
            // In this demo we don't validate passwords. If there's an existing stored user with the same
            // email we restore it; otherwise we create a simple user object.
            const existing = localStorage.getItem('authUser');
            if (existing) {
                const parsed = JSON.parse(existing);
                if (parsed.email === email) {
                    setUser(parsed);
                    return;
                }
            }
            const newUser: User = { id: crypto.randomUUID(), name: email.split('@')[0], email };
            setUser(newUser);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setIsLoading(true);
        try {
            await fakeDelay(500);
            const newUser: User = { id: crypto.randomUUID(), name, email };
            setUser(newUser);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
    };

    const updateProfile = async (name: string) => {
        setIsLoading(true);
        try {
            await fakeDelay(300);
            setUser((prev) => (prev ? { ...prev, name } : prev));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export default AuthProvider;
