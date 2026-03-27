import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';
import { Lock, User, AlertCircle, GraduationCap } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if already logged in
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'teacher') navigate('/teacher');
            else if (user.role === 'student') navigate('/student');
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network request
        setTimeout(() => {
            const result = login(username, password);

            if (result.success) {
                if (result.role === 'admin') navigate('/admin');
                else if (result.role === 'teacher') navigate('/teacher');
                else if (result.role === 'student') navigate('/student');
            } else {
                setError(result.message);
                setIsLoading(false);
            }
        }, 600);
    };

    return (
        <div className="min-h-screen flex flex-col gradient-bg">
            <Navbar />

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                            <GraduationCap className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
                        <p className="text-gray-500 mt-2">Sign in to access your portal</p>
                    </div>

                    <Card className="glass border-white/40">
                        <CardContent className="p-8">
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block" htmlFor="username">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 transition-colors text-gray-900"
                                            placeholder="admin, teacher, or student"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-gray-700 block" htmlFor="password">
                                            Password
                                        </label>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 transition-colors text-gray-900"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    fullWidth
                                    size="lg"
                                    disabled={isLoading || !username || !password}
                                    className="mt-2"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </span>
                                    ) : 'Sign In'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-primary hover:text-blue-700 font-semibold transition-colors">
                                        Register
                                    </Link>
                                </p>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-sm text-center text-gray-500 mb-4 font-medium">Demo Credentials</p>
                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-600 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                        <span className="font-semibold text-gray-900">Admin:</span>
                                        <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">admin / admin</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-semibold text-gray-900">Teacher:</span>
                                        <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">teacher / teacher</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="font-semibold text-gray-900">Student:</span>
                                        <span className="font-mono bg-white px-2 py-1 rounded shadow-sm">CSE2023001 / student</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 text-right mt-1">Note: Use student roll number as username</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Login;
