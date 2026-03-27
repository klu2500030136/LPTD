import { createContext, useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading] = useState(false);

    const login = (username, password) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find((u) => u.username === username && u.password === password);

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('currentUser', JSON.stringify(foundUser));
            return { success: true, role: foundUser.role };
        }
        return { success: false, message: 'Invalid credentials' };
    };

    const register = (userData) => {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if username already exists
        const userExists = users.some(u => u.username === userData.username);
        if (userExists) {
            return { success: false, message: 'Username/ID Number already exists' };
        }

        const newUser = {
            id: Date.now(),
            ...userData
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('users', JSON.stringify(updatedUsers));

        // Auto-login after registration
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        return { success: true, role: newUser.role };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('currentUser');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
