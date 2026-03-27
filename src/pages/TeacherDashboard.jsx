import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Card, { CardContent, CardHeader, CardTitle } from '../components/Card';
import Button from '../components/Button';
import { Edit2, Trash2, Plus, Calculator, User, Briefcase, FileText, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

const TeacherDashboard = () => {
    const [marks, setMarks] = useState(() => JSON.parse(localStorage.getItem('marks') || '[]'));
    const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('projects') || '[]'));
    const [students] = useState(() => {
        const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        return storedUsers.filter(u => u.role === 'student');
    });
    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('marks');
    const [formData, setFormData] = useState({
        id: null,
        studentId: '',
        subject: '',
        marks: ''
    });
    const [projectFormData, setProjectFormData] = useState({
        id: null,
        studentId: '',
        title: '',
        description: '',
        dueDate: ''
    });

    const saveMarks = (updatedMarks) => {
        setMarks(updatedMarks);
        localStorage.setItem('marks', JSON.stringify(updatedMarks));
    };

    const saveProjects = (updatedProjects) => {
        setProjects(updatedProjects);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
    };

    const handleProjectInputChange = (e) => {
        const { name, value } = e.target;
        setProjectFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProjectSubmit = (e) => {
        e.preventDefault();
        const student = students.find(s => s.id === Number(projectFormData.studentId));
        if (!student) {
            alert("Please select a valid student.");
            return;
        }

        if (isEditing && activeTab === 'projects') {
            const updatedProjects = projects.map(p =>
                p.id === projectFormData.id
                    ? { ...p, studentId: student.id, studentName: student.name, title: projectFormData.title, description: projectFormData.description, dueDate: projectFormData.dueDate }
                    : p
            );
            saveProjects(updatedProjects);
        } else {
            const newProject = {
                id: Date.now(),
                teacherName: 'Teacher',
                studentId: student.id,
                studentName: student.name,
                title: projectFormData.title,
                description: projectFormData.description,
                dueDate: projectFormData.dueDate,
                status: 'assigned',
                submittedLink: ''
            };
            saveProjects([...projects, newProject]);
        }
        setProjectFormData({ id: null, studentId: '', title: '', description: '', dueDate: '' });
        setIsEditing(false);
    };

    const handleProjectEdit = (proj) => {
        setProjectFormData({
            id: proj.id,
            studentId: proj.studentId,
            title: proj.title,
            description: proj.description,
            dueDate: proj.dueDate
        });
        setActiveTab('projects');
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleProjectDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this project?")) {
            const updatedProjects = projects.filter(p => p.id !== id);
            saveProjects(updatedProjects);
        }
    };

    const cancelProjectEdit = () => {
        setProjectFormData({ id: null, studentId: '', title: '', description: '', dueDate: '' });
        setIsEditing(false);
    };

    const calculateCGPA = (totalMarks) => {
        // Simple CGPA calculation logic: scale of 10 based on percentage out of 100
        return (totalMarks / 10).toFixed(1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const parsedMarks = Number(formData.marks);
        const score = parsedMarks; // Assuming score is out of 100
        const cgpa = Number(calculateCGPA(parsedMarks));

        // Find student name based on student ID
        const student = students.find(s => s.id === Number(formData.studentId));

        if (!student) {
            alert("Please select a valid student.");
            return;
        }

        if (isEditing) {
            // Update existing mark
            const updatedMarks = marks.map(m =>
                m.id === formData.id
                    ? { ...m, studentId: student.id, studentName: student.name, subject: formData.subject, marks: parsedMarks, score, cgpa }
                    : m
            );
            saveMarks(updatedMarks);
        } else {
            // Add new mark
            const newMark = {
                id: Date.now(),
                studentId: student.id,
                studentName: student.name,
                subject: formData.subject,
                marks: parsedMarks,
                score,
                cgpa
            };
            saveMarks([...marks, newMark]);
        }

        // Reset form
        setFormData({ id: null, studentId: '', subject: '', marks: '' });
        setIsEditing(false);
    };

    const handleEdit = (mark) => {
        setFormData({
            id: mark.id,
            studentId: mark.studentId,
            subject: mark.subject,
            marks: mark.marks
        });
        setIsEditing(true);
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this mark entry?")) {
            const updatedMarks = marks.filter(m => m.id !== id);
            saveMarks(updatedMarks);
        }
    };

    const cancelEdit = () => {
        setFormData({ id: null, studentId: '', subject: '', marks: '' });
        setIsEditing(false);
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full gap-8 flex flex-col lg:flex-row">

                {/* Left Column - Form */}
                <div className="lg:w-1/3 w-full">
                    <Card className="sticky top-24">
                        <CardHeader className={`${isEditing ? 'bg-amber-50 rounded-t-2xl border-amber-100' : 'bg-blue-50 rounded-t-2xl border-blue-100'}`}>
                            <CardTitle className={`flex items-center gap-2 ${isEditing ? 'text-amber-800' : 'text-blue-800'}`}>
                                {isEditing ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                                {isEditing ? (activeTab === 'projects' ? 'Edit Project' : 'Edit Marks') : (activeTab === 'projects' ? 'Assign New Project' : 'Add New Marks')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {activeTab === 'projects' ? (
                                <form onSubmit={handleProjectSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                                        <select
                                            name="studentId"
                                            value={projectFormData.studentId}
                                            onChange={handleProjectInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900"
                                            required
                                        >
                                            <option value="">-- Select Student --</option>
                                            {students.map(student => (
                                                <option key={student.id} value={student.id}>{student.name} ({student.username})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={projectFormData.title}
                                            onChange={handleProjectInputChange}
                                            placeholder="e.g., Final Presentation"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                            name="description"
                                            value={projectFormData.description}
                                            onChange={handleProjectInputChange}
                                            placeholder="Project requirements..."
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 resize-none"
                                            required
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="dueDate"
                                                value={projectFormData.dueDate}
                                                onChange={handleProjectInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 flex gap-3 flex-col sm:flex-row">
                                        <Button type="submit" fullWidth className={isEditing ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-white' : ''}>
                                            {isEditing ? 'Update Project' : 'Assign Project'}
                                        </Button>

                                        {isEditing && (
                                            <Button type="button" variant="outline" fullWidth onClick={cancelProjectEdit}>
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                                        <select
                                            name="studentId"
                                            value={formData.studentId}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary bg-white text-gray-900"
                                            required
                                        >
                                            <option value="">-- Select Student --</option>
                                            {students.map(student => (
                                                <option key={student.id} value={student.id}>{student.name} ({student.username})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="e.g., Mathematics"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Marks (out of 100)</label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="marks"
                                                min="0"
                                                max="100"
                                                value={formData.marks}
                                                onChange={handleInputChange}
                                                placeholder="Enter marks"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                                <Calculator className="h-4 w-4" />
                                            </div>
                                        </div>
                                        {formData.marks && (
                                            <p className="mt-2 text-sm text-emerald-600 font-medium">
                                                Auto-calculated CGPA: {calculateCGPA(formData.marks)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-4 flex gap-3 flex-col sm:flex-row">
                                        <Button type="submit" fullWidth className={isEditing ? 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500 text-white' : ''}>
                                            {isEditing ? 'Update Marks' : 'Save Marks'}
                                        </Button>

                                        {isEditing && (
                                            <Button type="button" variant="outline" fullWidth onClick={cancelEdit}>
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Table & Lists */}
                <div className="lg:w-2/3 w-full space-y-6">
                    {/* Tab Navigation */}
                    <div className="flex p-1 bg-white/50 backdrop-blur-md rounded-xl shadow-sm border border-gray-100">
                        <button
                            onClick={() => setActiveTab('marks')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'marks' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'}`}
                        >
                            Marks Record
                        </button>
                        <button
                            onClick={() => setActiveTab('students')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'students' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'}`}
                        >
                            Registered Students
                        </button>
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === 'projects' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'}`}
                        >
                            Projects
                        </button>
                    </div>

                    {activeTab === 'marks' && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Student Marks Record</CardTitle>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                    {marks.length} Records
                                </span>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                {marks.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Calculator className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p>No marks recorded yet.</p>
                                        <p className="text-sm mt-1">Use the form to add marks for students.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="border-y border-gray-100 bg-gray-50/50">
                                                <th className="px-6 py-4 font-semibold text-gray-600">Student Name</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600">Subject</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Marks / Score</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">CGPA</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {marks.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{item.studentName}</div>
                                                        <div className="text-xs text-gray-500">ID: {item.studentId}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                        {item.subject}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {item.marks} / 100
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.cgpa >= 8.5 ? 'bg-emerald-100 text-emerald-800' :
                                                            item.cgpa >= 7.0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {item.cgpa}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleEdit(item)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'students' && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Registered Students</CardTitle>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                    {students.length} Students
                                </span>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                {students.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <User className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p>No students registered yet.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="border-y border-gray-100 bg-gray-50/50">
                                                <th className="px-6 py-4 font-semibold text-gray-600">ID Number</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600">Student Name</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600">Branch</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {students.map((student) => (
                                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                            {student.username}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{student.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                            {student.branch || 'Not Specified'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'projects' && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Assigned Projects</CardTitle>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                                    {projects.length} Projects
                                </span>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                {projects.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                                        <p>No projects assigned yet.</p>
                                        <p className="text-sm mt-1">Use the form to assign projects to students.</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="border-y border-gray-100 bg-gray-50/50">
                                                <th className="px-6 py-4 font-semibold text-gray-600">Student Name</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600">Project Title</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Due Date</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                                                <th className="px-6 py-4 font-semibold text-gray-600 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {projects.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-medium text-gray-900">{item.studentName}</div>
                                                        <div className="text-xs text-gray-500">ID: {item.studentId}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                        {item.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                            <Calendar className="w-3 h-3 mr-1" /> {item.dueDate}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        {item.status === 'assigned' ? (
                                                            new Date(item.dueDate) < new Date(new Date().setHours(0, 0, 0, 0)) ? (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                                                                    <AlertCircle className="w-3 h-3 mr-1" /> Overdue
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                                                    Assigned
                                                                </span>
                                                            )
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-1">
                                                                    <CheckCircle className="w-3 h-3 mr-1" /> Submitted
                                                                </span>
                                                                {item.submittedLink && (
                                                                    <a href={item.submittedLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline flex items-center">
                                                                        <FileText className="w-3 h-3 mr-1" /> View
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => handleProjectEdit(item)}
                                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="Edit"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleProjectDelete(item.id)}
                                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeacherDashboard;
