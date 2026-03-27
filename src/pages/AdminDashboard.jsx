import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Card, { CardContent, CardHeader, CardTitle } from '../components/Card';
import { Users, Shield, GraduationCap, LayoutDashboard, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users') || '[]'));

    const handleDeleteUser = (userId, role) => {
        if (role === 'admin') {
            alert('Cannot remove admin users.');
            return;
        }
        if (window.confirm("Are you sure you want to remove this user's login access?")) {
            const updatedUsers = users.filter(u => u.id !== userId);
            setUsers(updatedUsers);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'teacher': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'student': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const stats = [
        { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Shield, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Teachers', value: users.filter(u => u.role === 'teacher').length, icon: LayoutDashboard, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'Students', value: users.filter(u => u.role === 'student').length, icon: GraduationCap, color: 'text-orange-500', bg: 'bg-orange-50' },
    ];

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">System overview and user management</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <Card key={index} className="card-hover">
                            <CardContent className="p-6 flex items-center">
                                <div className={`p-4 rounded-xl ${stat.bg} mr-5`}>
                                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Users Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Users</CardTitle>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="border-y border-gray-100 bg-gray-50/50">
                                    <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Username</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Role</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">ID</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {user.username}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getRoleBadgeColor(user.role)} uppercase tracking-wider`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-mono">
                                            #{user.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => handleDeleteUser(user.id, user.role)}
                                                disabled={user.role === 'admin'}
                                                className={`p-1.5 rounded-lg transition-colors ${user.role === 'admin' ? 'text-gray-300 cursor-not-allowed' : 'text-red-600 hover:bg-red-50'}`}
                                                title="Revoke Access"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
};

export default AdminDashboard;
