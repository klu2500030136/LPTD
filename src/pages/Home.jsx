import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, BarChart3, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card, { CardContent } from '../components/Card';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative flex-grow flex items-center pt-20 pb-32 overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-40 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-primary text-sm font-semibold tracking-wide border border-blue-100 mb-6">
                            Next-Generation Management
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                            Manage student data <br className="hidden md:block" />
                            <span className="gradient-text">with absolute ease.</span>
                        </h1>
                        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                            A comprehensive system for administrators, teachers, and students to track performance, manage marks, and achieve academic excellence.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link to="/login">
                                <Button size="lg" className="group">
                                    Get Started
                                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="bg-white/50 backdrop-blur-sm">
                                Learn More
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need in one place</h2>
                        <p className="text-lg text-gray-500">Role-based access ensures everyone sees exactly what they need.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="card-hover">
                            <CardContent className="pt-8 text-center group">
                                <div className="mx-auto w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                                    <Users className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Admin Control</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Complete oversight of the system. Manage users, monitor activity, and maintain system integrity.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="card-hover">
                            <CardContent className="pt-8 text-center group">
                                <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                                    <BookOpen className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Teacher Portal</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Efficiently add, edit, and analyze student marks. Auto-calculated CGPA saves valuable time.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="card-hover">
                            <CardContent className="pt-8 text-center group">
                                <div className="mx-auto w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:scale-110 transition-transform duration-300">
                                    <BarChart3 className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Student Analytics</h3>
                                <p className="text-gray-500 leading-relaxed">
                                    Visual performance tracking using interactive charts. Keep track of subjects and overall progress.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} LPTD. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Home;
