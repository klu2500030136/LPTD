export const initialUsers = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin', name: 'System Admin' },
    { id: 2, username: 'teacher', password: 'teacher', role: 'teacher', name: 'Mr. Smith' },
];

export const initialMarks = [
    { id: 1, studentId: 101, studentName: 'Arjun Reddy', subject: 'Mathematics', marks: 85, score: 85, cgpa: 8.5 },
    { id: 2, studentId: 101, studentName: 'Arjun Reddy', subject: 'Physics', marks: 78, score: 78, cgpa: 7.8 },
    { id: 3, studentId: 101, studentName: 'Arjun Reddy', subject: 'Chemistry', marks: 92, score: 92, cgpa: 9.2 },
];

export const initialProjects = [
    { id: 1, teacherName: 'Mr. Smith', studentId: 101, studentName: 'Arjun Reddy', title: 'React Dashboard', description: 'Build a dashboard using React and Tailwind', dueDate: '2026-04-15', status: 'assigned', submittedLink: '' }
];

export const initLocalStorage = async () => {
    try {
        const response = await fetch('https://webapi-eiw9.onrender.com/jobs');
        const data = await response.json();

        const apiStudents = data.students.map((student) => ({
            id: student.id + 100, // Offset IDs to prevent clashes with system users
            username: student.rollNumber || 'student', // Fallback for testing
            password: 'student',
            role: 'student',
            name: student.name,
            branch: student.branch,
            cgpa: student.cgpa,
            image: student.image,
        }));

        const allUsers = [...initialUsers, ...apiStudents];
        localStorage.setItem('users', JSON.stringify(allUsers));
    } catch (error) {
        console.error("Failed to fetch API data:", error);
        // Fallback to minimal users array if the API offline
        localStorage.setItem('users', JSON.stringify([
            ...initialUsers,
            { id: 3, username: 'student', password: 'student', role: 'student', name: 'John Doe' }
        ]));
    }

    if (!localStorage.getItem('marks')) {
        localStorage.setItem('marks', JSON.stringify(initialMarks));
    }

    if (!localStorage.getItem('projects')) {
        localStorage.setItem('projects', JSON.stringify(initialProjects));
    }
};
