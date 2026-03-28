import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Card, { CardContent, CardHeader, CardTitle } from '../components/Card';
import { AuthContext } from '../context/AuthContext';
import { Trophy, BookOpen, Target, TrendingUp, AlertCircle, Briefcase, Calendar, Clock, CheckCircle, UploadCloud, FileText } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [marks] = useState(() => {
        if (user) {
            const allMarks = JSON.parse(localStorage.getItem('marks') || '[]');
            return allMarks.filter(m => m.studentId === user.id);
        }
        return [];
    });

    const [activeTab, setActiveTab] = useState('overview');
    const [projects, setProjects] = useState(() => {
        if (user) {
            const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
            return allProjects.filter(p => p.studentId === user.id);
        }
        return [];
    });
    const [submittingId, setSubmittingId] = useState(null);
    const [submitLink, setSubmitLink] = useState('');

    const handleSubmitProject = (e, projectId) => {
        e.preventDefault();
        const allProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        const updatedAllProjects = allProjects.map(p =>
            p.id === projectId ? { ...p, status: 'submitted', submittedLink: submitLink } : p
        );
        localStorage.setItem('projects', JSON.stringify(updatedAllProjects));

        setProjects(updatedAllProjects.filter(p => p.studentId === user?.id));
        setSubmittingId(null);
        setSubmitLink('');
    };

    // Calculate overall statistics
    const totalSubjects = marks.length;
    const overallCGPA = totalSubjects > 0
        ? (marks.reduce((acc, curr) => acc + Number(curr.cgpa), 0) / totalSubjects).toFixed(2)
        : 0;
    const totalScore = marks.reduce((acc, curr) => acc + Number(curr.score), 0);
    const averageScore = totalSubjects > 0 ? (totalScore / totalSubjects).toFixed(1) : 0;

    // Chart Data: Bar Chart (Subject vs Marks)
    const barChartData = {
        labels: marks.map(m => m.subject),
        datasets: [
            {
                label: 'Subject Marks',
                data: marks.map(m => m.marks),
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Primary blue
                borderColor: 'rgb(37, 99, 235)',
                borderWidth: 1,
                borderRadius: 6,
                barPercentage: 0.6,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            x: { grid: { display: false } }
        },
    };

    // Chart Data: Line Chart (Performance Trend)
    // For the sake of the demo, we'll plot subjects chronologically as a trend
    const lineChartData = {
        labels: marks.map((m, i) => `Term ${i + 1}`),
        datasets: [
            {
                fill: true,
                label: 'CGPA Trend',
                data: marks.map(m => m.cgpa),
                borderColor: 'rgb(16, 185, 129)', // Emerald
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(16, 185, 129)',
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 0,
                max: 10,
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            x: { grid: { display: false } }
        },
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Dashboard</h1>
                        <p className="text-gray-500 mt-2 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                ID: {user?.id}
                            </span>
                            Academic Performance Overview
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 glass px-6 py-3 rounded-2xl flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overall CGPA</p>
                            <p className="text-3xl font-bold text-primary">{overallCGPA}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex p-1 bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-gray-100 mb-8 max-w-sm">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'}`}
                    >
                        Academic Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'projects' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'}`}
                    >
                        Projects & Assignments
                    </button>
                </div>

                {activeTab === 'overview' && (
                    <>
                        {totalSubjects === 0 ? (
                            <Card className="text-center py-16">
                                <CardContent>
                                    <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900">No Marks Available</h3>
                                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                        Your academic records have not been uploaded yet. Please contact your teacher or administrator.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Quick Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <Card className="card-hover">
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
                                                <BookOpen className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Enrolled Subjects</p>
                                                <p className="text-2xl font-bold text-gray-900">{totalSubjects}</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="card-hover">
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
                                                <Target className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Average Score</p>
                                                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="card-hover">
                                        <CardContent className="p-6 flex items-center gap-4">
                                            <div className="p-4 rounded-xl bg-orange-50 text-orange-600">
                                                <TrendingUp className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Total Marks</p>
                                                <p className="text-2xl font-bold text-gray-900">{totalScore}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Charts Section */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Subject Performance</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-80">
                                                <Bar data={barChartData} options={barChartOptions} />
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>CGPA Trend</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="h-80">
                                                <Line data={lineChartData} options={lineChartOptions} />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Detailed Table */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Subject Details</CardTitle>
                                    </CardHeader>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse text-sm">
                                            <thead>
                                                <tr className="border-y border-gray-100 bg-gray-50/50">
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Subject</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">Marks (out of 100)</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">Score Percentage</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">CGPA</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Remarks</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {marks.map((item) => (
                                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-medium text-gray-900">{item.subject}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                                                {item.marks}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 max-w-[200px] mx-auto">
                                                                <div
                                                                    className={`h-2.5 rounded-full ${item.score >= 85 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                                    style={{ width: `${item.score}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-500">{item.score}%</span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${item.cgpa >= 8.5 ? 'bg-emerald-100 text-emerald-800' :
                                                                item.cgpa >= 7.0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {item.cgpa}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="text-sm text-gray-700 inline-block w-full min-w-[150px] max-w-[200px] whitespace-normal">
                                                                {item.remarks || '-'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </>
                        )}
                    </>
                )}

                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        {projects.length === 0 ? (
                            <Card className="text-center py-16">
                                <CardContent>
                                    <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-gray-900">No Projects Assigned</h3>
                                    <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                        You currently have no active projects or assignments.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(project => (
                                    <Card key={project.id} className="flex flex-col h-full card-hover">
                                        <CardHeader className="pb-3 border-b border-gray-100 flex-none">
                                            <div className="flex justify-between items-start mb-2">
                                                <CardTitle className="text-lg leading-tight">{project.title}</CardTitle>
                                                {project.status === 'assigned' ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-700 whitespace-nowrap">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 whitespace-nowrap">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Submitted
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium flex items-center">
                                                <span className="mr-3">By: {project.teacherName || 'Teacher'}</span>
                                            </p>
                                        </CardHeader>
                                        <CardContent className="pt-4 flex-grow flex flex-col">
                                            <p className="text-sm text-gray-600 mb-4 flex-grow relative line-clamp-3">
                                                {project.description}
                                            </p>

                                            <div className="flex items-center text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg mt-auto">
                                                <Calendar className="w-4 h-4 mr-2 text-primary" />
                                                <span className="font-semibold text-gray-700 mr-2">Due Date:</span> {project.dueDate}
                                            </div>

                                            {project.status === 'assigned' ? (
                                                submittingId === project.id ? (
                                                    <form onSubmit={(e) => handleSubmitProject(e, project.id)} className="mt-2 space-y-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                                                        <input
                                                            type="url"
                                                            required
                                                            placeholder="Paste your submission link here..."
                                                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white"
                                                            value={submitLink}
                                                            onChange={(e) => setSubmitLink(e.target.value)}
                                                        />
                                                        <div className="flex gap-2">
                                                            <button type="submit" className="flex-1 py-1.5 px-3 bg-primary hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center">
                                                                <UploadCloud className="w-4 h-4 mr-1.5" /> Submit
                                                            </button>
                                                            <button type="button" onClick={() => setSubmittingId(null)} className="flex-[0.5] py-1.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            setSubmittingId(project.id);
                                                            setSubmitLink('');
                                                        }}
                                                        className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center mt-2 group"
                                                    >
                                                        Submit Work
                                                    </button>
                                                )
                                            ) : (
                                                <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                                    <p className="text-xs text-emerald-800 font-medium mb-1 flex items-center">
                                                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Already submitted
                                                    </p>
                                                    <a href={project.submittedLink} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center truncate">
                                                        <FileText className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
                                                        {project.submittedLink}
                                                    </a>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
