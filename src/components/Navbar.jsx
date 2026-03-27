import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { GraduationCap, LogOut, Menu, X } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        return `/${user.role}`;
    };

    return (
        <nav className="nav-glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                                <GraduationCap className="h-6 w-6 text-primary" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gray-900">LPTD</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-primary font-medium transition-colors">Home</Link>
                        <Link to="#" className="text-gray-600 hover:text-primary font-medium transition-colors">About</Link>
                        <Link to="#" className="text-gray-600 hover:text-primary font-medium transition-colors">Contact</Link>

                        {user ? (
                            <div className="flex items-center gap-4 border-l border-gray-200 pl-6 text-sm">
                                <span className="text-gray-500">
                                    Welcome, <span className="font-semibold text-gray-900">{user.name}</span>
                                    <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase text-xs font-bold tracking-wider">
                                        {user.role}
                                    </span>
                                </span>
                                <Link to={getDashboardLink()} className="text-primary hover:text-blue-700 font-medium font-medium transition-colors">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-1.5 text-red-500 hover:text-red-700 font-medium transition-colors ml-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    to="/login"
                                    className="bg-primary hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>

                  
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-gray-500 hover:text-gray-700 p-2 focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

           
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-4 pt-2 pb-6 space-y-1">
                        <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">Home</Link>
                        <Link to="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">About</Link>
                        <Link to="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary">Contact</Link>

                        {user ? (
                            <div className="mt-4 pt-4 border-t border-gray-100 pb-2">
                                <div className="px-3 mb-2">
                                    <p className="text-sm font-medium text-gray-500">Signed in as</p>
                                    <p className="text-base font-semibold text-gray-900">{user.name} ({user.role})</p>
                                </div>
                                <Link to={getDashboardLink()} className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-blue-50">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 mt-1"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                                    className="w-full text-center block px-3 py-3 rounded-xl text-base font-medium text-white bg-primary hover:bg-blue-600 shadow-sm"
                                >
                                    Login
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
