import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Url from "../../../constants";
import ConfirmationModal from "../delete/confirmationModal";

const EditTeacher = ({ teacherId }) => {
    const { status, data } = useSession();
    const router = useRouter();
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [errors, setErrors] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);

    useEffect(() => {
        fetchTeacherData();
    }, [teacherId]);

    async function fetchTeacherData() {
        try {
            const resp = await fetch(`${Url}api/teachers/teacher/${teacherId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.user.token}`
                }
            })
            const teacherData = await resp.json();
            setEditingTeacher(teacherData);
        } catch (error) {
            console.error('Error fetching teacher data:', error);
        }
    }

    const isValidEmail = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailPattern.test(value);
    };

    const handleInputChange = (e, fieldName) => {
        const value = e.target.value;
        let error = '';

        if (fieldName === 'first_name' || fieldName === 'last_name' || fieldName === 'email') {
            if (!value) {
                error = 'Polje je obavezno!';
            } 
        }

        if (fieldName === 'email' && value && !isValidEmail(value)) {
            error = 'Neispravna email adresa!';
        }

        setEditingTeacher(prevState => ({
            ...prevState,
            [fieldName]: value
        }));

        setErrors(prevState => ({
            ...prevState,
            [fieldName]: error
        }));
    };

    const handleFormSubmit = () => {
        const newErrors = {};

        if (!editingTeacher.first_name) {
            newErrors.first_name = 'Polje je obavezno!';
        }

        if (!editingTeacher.last_name) {
            newErrors.last_name = 'Polje je obavezno!';
        }

        if (!editingTeacher.email) {
            newErrors.email = 'Polje je obavezno!';
        } else if (!isValidEmail(editingTeacher.email)) {
            newErrors.email = 'Neispravna email adresa!';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            setShowConfirmationModal(true);
        }
    };

    const updateTeacher = async () => {
        try {
            const resp = await fetch(`${Url}api/teachers/teacher/${editingTeacher.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.user.token}`
                },
                body: JSON.stringify(editingTeacher)
            });

            if (resp.ok) {
                console.log('Teacher updated successfully');
                router.push('/admin/listTeachers');
            } else {
                console.error('Failed to update teacher');
            }
        } catch (error) {
            console.error('Error updating teacher:', error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-200 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-md">
                {editingTeacher && (
                    <div>
                        <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">Edituj nastavnika</h1>
                        <div className="mb-1 font-bold text-gray-800">Ime:</div>
                        <input
                            type="text"
                            value={editingTeacher.first_name}
                            onChange={(e) => handleInputChange(e, 'first_name')}
                            className={`w-full border border-gray-300 rounded-md mb-2 px-4 py-2 ${errors.first_name ? 'border-red-500' : ''}`}
                        />
                        {errors.first_name && (
                            <p className="text-red-500 italic">{errors.first_name}</p>
                        )}
                        <div className="mb-1 font-bold text-gray-800">Prezime:</div>
                        <input
                            type="text"
                            value={editingTeacher.last_name}
                            onChange={(e) => handleInputChange(e, 'last_name')}
                            className={`w-full border border-gray-300 rounded-md mb-2 px-4 py-2 ${errors.last_name ? 'border-red-500' : ''}`}
                        />
                        {errors.last_name && (
                            <p className="text-red-500 italic">{errors.last_name}</p>
                        )}
                        <div className="mb-1 font-bold text-gray-800">Email:</div>
                        <input
                            type="text"
                            value={editingTeacher.email}
                            onChange={(e) => handleInputChange(e, 'email')}
                            className={`w-full border border-gray-300 rounded-md mb-2 px-4 py-2 ${errors.email ? 'border-red-500' : ''}`}
                        />
                        {errors.email && (
                            <p className="text-red-500 italic">{errors.email}</p>
                        )}
                        <div className="flex justify-center pt-4">
                            <button onClick={handleFormSubmit} className="w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2">Sačuvaj</button>
                            <button onClick={handleCancel} className="w-40 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-lg ml-2">Otkaži</button>
                        </div>
                    </div>
                )}
            </div>
            {showConfirmationModal && (
                <ConfirmationModal
                    message={`Da li ste sigurni da želite ažurirati podatke o nastavniku?`}
                    onConfirm={() => {
                        updateTeacher();
                        setShowConfirmationModal(false);
                    }}
                    onCancel={() => setShowConfirmationModal(false)}
                />
            )}
        </div>
    );
};

export default EditTeacher;
