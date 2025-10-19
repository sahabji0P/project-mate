import api from './api';

export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface UpdateProfileData {
    name?: string;
    email?: string;
}

class AuthService {
    // Register new user
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post('/auth/register', data);
        const authData = response.data.data;

        // Store tokens and user data
        this.storeAuthData(authData);

        return authData;
    }

    // Login user
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post('/auth/login', data);
        const authData = response.data.data;

        // Store tokens and user data
        this.storeAuthData(authData);

        return authData;
    }

    // Logout user
    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            try {
                await api.post('/auth/logout', { refreshToken });
            } catch (error) {
                console.error('Logout error:', error);
            }
        }

        // Clear local storage
        this.clearAuthData();
    }

    // Refresh access token
    async refreshToken(): Promise<string> {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        const response = await api.post('/auth/refresh', { refreshToken });
        const { accessToken } = response.data.data;

        localStorage.setItem('accessToken', accessToken);

        return accessToken;
    }

    // Get current user profile
    async getProfile(): Promise<User> {
        const response = await api.get('/users/profile');
        return response.data.data;
    }

    // Update user profile
    async updateProfile(data: UpdateProfileData): Promise<User> {
        const response = await api.put('/users/profile', data);
        const user = response.data.data;

        // Update stored user data
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    }

    // Store auth data in localStorage
    private storeAuthData(authData: AuthResponse): void {
        localStorage.setItem('accessToken', authData.accessToken);
        localStorage.setItem('refreshToken', authData.refreshToken);
        localStorage.setItem('user', JSON.stringify(authData.user));
    }

    // Clear auth data from localStorage
    private clearAuthData(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    // Get stored user data
    getStoredUser(): User | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    // Get access token
    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}

export default new AuthService();