import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Card, { CardContent } from '../components/Card';
import Button from '../components/Button';
import { Lock, User, AlertCircle, GraduationCap, Building2, UserPlus } from 'lucide-react';

const Register = () => {
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        password: '',
        branch: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if already logged in
        if (user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'teacher') navigate('/teacher');
            else if (user.role === 'student') navigate('/student');
        }
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Core Required Fields Validation
            if (!formData.name || !formData.username || !formData.password) {
                throw new Error('Please fill in all required fields');
            }

            // Name validation (only letters and spaces, 3-50 chars)
            if (!/^[a-zA-Z\s]{3,50}$/.test(formData.name.trim())) {
                throw new Error('Please enter a valid name (letters and spaces only, min 3 characters)');
            }

            // Role-specific identity validation
            if (role === 'student') {
                // Student ID validation (at least 5 alphanumeric characters)
                if (!/^[A-Za-z0-9]{5,20}$/.test(formData.username.trim())) {
                    throw new Error('Please enter a valid ID Number (e.g., CSE20230XX)');
                }

                // Branch presence and validation
                if (!formData.branch || !formData.branch.trim()) {
                    throw new Error('Please specify your branch');
                }
                if (!/^[a-zA-Z\s'&.-]{2,50}$/.test(formData.branch.trim())) {
                    throw new Error('Please enter a valid branch name');
                }
            } else if (role === 'teacher') {
                // Teacher username validation (alphanumeric and underscores)
                if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username.trim())) {
                    throw new Error('Username must be 3-20 characters long (letters, numbers, underscores)');
                }
            }

            // Password length validation
            if (formData.password.length < 6) {
                throw new Error('Password must be at least 6 characters long');
            }

            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 800));

            const result = register({
                ...formData,
                role
            });

            if (result.success) {
                if (result.role === 'teacher') navigate('/teacher');
                else if (result.role === 'student') navigate('/student');
            } else {
                setError(result.message);
                setIsLoading(false);
            }
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col gradient-bg">
            <Navbar />

            <div className="flex-grow flex items-center justify-center p-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                            <UserPlus className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create an Account</h1>
                        <p className="text-gray-500 mt-2">Join EduManage today</p>
                    </div>

                    <Card className="glass border-white/40">
                        <CardContent className="p-8">
                            {error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-600 text-sm">
                                    <AlertCircle className="h-5 w-5 shrink-0" />
                                    <p>{error}</p>
                                </div>
                            )}

                            {/* Role Selection Toggle */}
                            <div className="flex p-1 bg-gray-100/50 rounded-xl mb-6">
                                <button
                                    type="button"
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'student' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setRole('student')}
                                >
                                    Student
                                </button>
                                <button
                                    type="button"
                                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${role === 'teacher' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                    onClick={() => setRole('teacher')}
                                >
                                    Teacher
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block" htmlFor="name">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 transition-colors text-gray-900"
                                            placeholder="Your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block" htmlFor="username">
                                        {role === 'student' ? 'ID Number' : 'Username'}
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <GraduationCap className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 transition-colors text-gray-900"
                                            placeholder={role === 'student' ? 'e.g., CSE20230XX' : 'Choose a username'}
                                            required
                                        />
                                    </div>
                                    {role === 'student' && <p className="text-[10px] text-gray-500 text-right">This will be used for your login</p>}
                                </div>

                                {role === 'student' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 block" htmlFor="branch">
                                            Branch Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                <Building2 className="h-5 w-5" />
                                            </div>
                                            <input
                                                id="branch"
                                                name="branch"
                                                type="text"
                                                value={formData.branch}
                                                onChange={handleInputChange}
                                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white/50 transition-colors text-gray-900"
                                                placeholder="e.g., Computer Science"
                                                required={role === 'student'}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 block" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
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
                                    disabled={isLoading}
                                    className="mt-6"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : 'Register'}
                                </Button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary hover:text-blue-700 font-semibold transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Register;