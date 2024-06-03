import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Url from "../../../constants";
import ConfirmationModal from "../delete/confirmationModal";

const EditStudent = ({ studentId }) => {
    const { data } = useSession();
    const router = useRouter();
    const [editingStudent, setEditingStudent] = useState(null);
    const [errors, setErrors] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    async function fetchStudentData() {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list/${studentId}`, {
                method: 'GET',
            });
            const studentData = await resp.json();
            setEditingStudent(studentData);
        } catch (error) {
            console.error('Error fetching student data:', error);
        }
    }

    const isValidEmail = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailPattern.test(value);
    };

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        let error = '';

        if (fieldName === 'name' || fieldName === 'guardian_name') {
            if (!value) {
                error = 'Polje je obavezno!';
            } 
        }

        if (fieldName === 'last_name') {
            if (!value) {
                error = 'Polje je obavezno!';
            }
        }

        setEditingStudent(prevState => ({
            ...prevState,
            [fieldName]: value,
        }));

        setErrors(prevState => ({
            ...prevState,
            [fieldName]: error,
        }));
    };

    const handleFormSubmit = async () => {
        const newErrors = {};
    
        if (!editingStudent.name) {
            newErrors.name = 'Polje je obavezno!';
        }
    
        if (!editingStudent.last_name) {
            newErrors.last_name = 'Polje je obavezno!';
        }
    
        if (editingStudent.email && !isValidEmail(editingStudent.email)) {
            newErrors.email = 'Neispravna email adresa!';
        }
    
        if (!editingStudent.guardian_name) {
            newErrors.guardian_name = 'Polje je obavezno!';
        }
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length === 0) {
            setShowConfirmationModal(true);
        }
    };
    
    // Function to handle updating the student
    const updateStudent = async () => {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list/${editingStudent.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.user.token}`
                },
                body: JSON.stringify(editingStudent)
            });
            if (resp.ok) {
                const redirectUrl = data.user.is_superuser ? '/admin/listStudents' : '/user';
                router.push(redirectUrl);
            } else {
                console.error('Failed to update student');
            }
        } catch (error) {
            console.error('Error updating student:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="flex justify-center items-start h-screen w-screen bg-gray-200 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-lg mt-4">
                {editingStudent && (
                    <div>
                        <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">{editingStudent.name} {editingStudent.last_name}</h1>
                        <div className="mb-1 font-bold text-gray-800">Ime:</div>
                        <input
                            type="text"
                            placeholder="Unesite ime učenika"
                            value={editingStudent.name}
                            onChange={(e) => handleInputChange(e, 'name')}
                            required
                            maxLength={30}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        {errors.name && (
                            <p className="text-red-500 italic">{errors.name}</p>
                        )}
                        <div className="mb-1 mt-1 font-bold text-gray-800">Srednje ime:</div>
                        <input
                            type="text"
                            placeholder="Unesite srednje ime učenika (nije obavezno)"
                            value={editingStudent?.middle_name || ''}
                            onChange={(e) => handleInputChange(e, 'middle_name')}
                            maxLength={30}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        {errors.middle_name && (
                            <p className="text-red-500 italic">{errors.middle_name}</p>
                        )}
                        <div className="mb-1 mt-1 font-bold text-gray-800">Prezime:</div>
                        <input
                            type="text"
                            placeholder="Unesite prezime učenika"
                            value={editingStudent.last_name}
                            onChange={(e) => handleInputChange(e, 'last_name')}
                            maxLength={50}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        {errors.last_name && (
                            <p className="text-red-500 italic">{errors.last_name}</p>
                        )}
                        <div className="mb-1 mt-1 font-bold text-gray-800">Ime jednog roditelja:</div>
                        <input
                            type="text"
                            placeholder="Ime jednog roditelja"
                            value={editingStudent.guardian_name}
                            onChange={(e) => handleInputChange(e, 'guardian_name')}
                            maxLength={30}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        {errors.guardian_name && (
                            <p className="text-red-500 italic">{errors.guardian_name}</p>
                        )}
                        <div className="mb-1 mt-1 font-bold text-gray-800">Email:</div>
                        <input
                            type="text"
                            placeholder="Unesite email učenika (nije obavezno)"
                            value={editingStudent.email}
                            onChange={(e) => handleInputChange(e, 'email')}
                            className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2"
                        />
                        {errors.email && (
                            <p className="text-red-500 italic">{errors.email}</p>
                        )}
                        <div className="mb-1 mt-1 font-bold text-gray-800">Status:</div>
                            <select
                                value={editingStudent.special_case}
                                onChange={(e) => handleInputChange(e, 'special_case')}
                                className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2">
                                <option value="regular">Regular student</option>
                                <option value="generation_best_student">Učenik generacije</option>
                                <option value="unconditional">Bezuslovni</option>
                            </select>
                        <div className="flex justify-center pt-4">
                            <button onClick={handleFormSubmit} className="w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2">Sačuvaj</button>
                            <button onClick={handleCancel} className="w-40 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-lg ml-2">Otkaži</button>
                        </div>
                    </div>
                )}
            </div>
            {showConfirmationModal && (
                <ConfirmationModal
                    message={`Da li ste sigurni da želite ažurirati podatke o učeniku?`}
                    onConfirm={() => {
                        updateStudent();
                        setShowConfirmationModal(false);
                    }}
                    onCancel={() => setShowConfirmationModal(false)}
                />
            )}
        </div>
    );
};

export default EditStudent;
