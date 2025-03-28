import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const AssignStudents = ({ courseId, closeDropdown }) => {
    const { user } = useUser();
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dueDate, setDueDate] = useState(null);  // Using Date object for DatePicker
    const [hasDueDate, setHasDueDate] = useState(false);

    useEffect(() => {
        if(user?._id)
        {
        const fetchStudents = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/students/${user?._id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch students');
                const data = await response.json();
                setStudents(Array.isArray(data.students) ? data.students : []);
            } catch (error) {
                console.error('Error fetching students:', error);
                setStudents([]);
            }
        };


        const checkDueDate = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/assigned?orgCourseId=${courseId}`);
                if (!response.ok) throw new Error('Failed to check assigned course');

                const data = await response.json();
                const assignedCourse = data.find(ac => ac.orgCourseId._id === courseId);

                if (assignedCourse?.dueDate) {
                    setHasDueDate(true);
                    setDueDate(new Date(assignedCourse.dueDate)); // Set Date object
                }
            } catch (error) {
                console.error('Error checking due date:', error);
            }
        };

        fetchStudents();
        checkDueDate();
}}, [user._id, user.token, courseId]);

    const handleCheckboxChange = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
        );
    };

    const selectAllStudents = () => {
        if (selectedStudents.length === students.length) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(m => m._id));
        }
    };

    const getAssignedCourseId = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/assigned?orgCourseId=${courseId}`);
            if (!response.ok) throw new Error('Failed to fetch assignedCourseId');

            const data = await response.json();
            const assignedCourse = data.find(ac => ac.orgCourseId._id === courseId);
            return assignedCourse?._id;
        } catch (error) {
            console.error('Error fetching assignedCourseId:', error);
            return null;
        }
    };

    const assignStudents = async () => {
        if (selectedStudents.length === 0) return;

        setLoading(true);
        try {
            const assignedCourseId = await getAssignedCourseId();
            if (!assignedCourseId) {
                alert('No assigned course found for this course.');
                return;
            }

            for (const studentId of selectedStudents) {
                const response = await fetch(`http://localhost:8000/api/assigned/${assignedCourseId}/addStudent`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ studentId, orgCourseId: courseId })
                });

                if (!response.ok) throw new Error(`Failed to assign student ${studentId}`);
            }

            if (!hasDueDate && dueDate) {
                await fetch(`http://localhost:8000/api/assigned/${assignedCourseId}/setDueDate`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`
                    },
                    body: JSON.stringify({ dueDate: dueDate.toISOString() })
                });
            }

            alert('Students assigned successfully!');
            closeDropdown();  // Close after success
        } catch (error) {
            console.error('Error assigning students:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute left-0 mt-2 bg-white border border-red-500 rounded-lg shadow-lg w-56 p-3 z-50">
            <h4 className="text-lg font-semibold mb-2">Select Students</h4>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Students List</span>
                <button
                    type="button"
                    className="text-blue-500 text-xs"
                    onClick={selectAllStudents}
                >
                    {selectedStudents.length === students.length ? 'Deselect All' : 'Select All'}
                </button>
            </div>

            <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                {students.length > 0 ? (
                    students.map((student) => (
                        <label key={student._id} className="flex items-center space-x-2 text-gray-700 mb-1">
                            <input
                                type="checkbox"
                                value={student._id}
                                onChange={() => handleCheckboxChange(student._id)}
                                checked={selectedStudents.includes(student._id)}
                            />
                            <span>{student.name}</span>
                        </label>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No students found</p>
                )}
            </div>

            {!hasDueDate && (
                <div className="mt-3">
                    <label className="text-sm font-medium text-gray-700">Due Date</label>
                    <DatePicker
                        selected={dueDate}
                        onChange={date => setDueDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        placeholderText="Select Due Date"
                    />
                </div>
            )}

            <button
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={assignStudents}
                disabled={loading}
            >
                {loading ? 'Assigning...' : 'Assign'}
            </button>
        </div>
    );
};

export default AssignStudents;
