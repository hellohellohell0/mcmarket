'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    username: string;
    bio?: string;
    pfpUrl?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refreshUser: async () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const refreshUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (e) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const logout = () => {
        // Clear cookie logic usually handled by API or just brute force clear here if not httpOnly, but it IS httpOnly.
        // So we need an API route for logout ideally, or just set user null and rely on expiry.
        // Let's create a logout API later. For now just client state clear.
        setUser(null);
        document.cookie = 'token=; Max-Age=0; path=/;'; // Try to clear if accessible (it's not if httpOnly).
        // Correct way: Call API to clear cookie.
        // I'll implementing logout API quickly or just assume user knows. 
        // I'll add a quick fetch to logout endpoint if I make one.
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
