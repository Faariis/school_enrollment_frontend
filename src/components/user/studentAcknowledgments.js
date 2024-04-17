import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import Url from "../../../constants";

const AcknowledgmentForm = ({ studentId }) => {
    const { data } = useSession();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [editingStudent, setEditingStudent] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [alreadyExists, setAlreadyExists] = useState(false);
    const [showPoints, setShowPoints] = useState(false); // Define showPoints state

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    async function fetchStudentData() {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/acknowledgments/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${data.user.token}`
                }
            });
            const studentData = await resp.json();
            setEditingStudent(studentData);
        } catch (error) {
            console.error('Error fetching teacher data:', error);
        }
    }

    const checkExistingAcknowledgment = (formData) => {
        const existingAcknowledgment = editingStudent.find((ack) =>
            ack.ack_name === formData.ack_name &&
            ack.ack_class_id === formData.ack_class_id &&
            ack.ack_level === formData.ack_level
        );
        return !!existingAcknowledgment;
    };
    
    const onSubmit = async (formData) => {
        try {
            const exists = checkExistingAcknowledgment(formData);
            setAlreadyExists(exists);
            if (exists) {
                console.error('Takmičenje već postoji za ovog učenika.');
                return;
            }
            const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/acknowledgments/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.user.token}`
                },
                body: JSON.stringify(formData)
            });
    
            if (resp.ok) {
                console.log('Novo takmičenje uspješno dodano');
                fetchStudentData();
                setShowForm(false);
            } else {
                console.error('Neuspješno dodavanje novog takmičenja');
            }
        } catch (error) {
            console.error('Greška prilikom dodavanja novog takmičenja:', error);
        }
    };

    return (
        <div>
            {/* The form automatically renders if there are no acknowledgments in the table; */}
            {(editingStudent === null || editingStudent.length === 0 || showForm) && (
              <div className="flex justify-center items-start h-screen bg-gray-200 bg-opacity-75">
                <div className="bg-white p-8 rounded-lg shadow-lg mt-12">
                    <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">Dodaj novo takmičenje</h1>
                    <form className="mt-8" onSubmit={handleSubmit(onSubmit)}>
                        <input type="hidden" {...register('pupil_id')} value={studentId} />
                        <input type="text" {...register('ack_name', { required: true })} placeholder="Naziv takmičenja" className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2" />
                        {errors.ack_name && <p className="text-red-500 text-xs mb-2">Polje obavezno!</p>}
                        <select {...register('ack_level', { required: true })} className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2">
                            <option value="">Odaberi vrstu takmičenja</option>
                            <option value="Federalno">Federalno</option>
                            <option value="Kantonalno">Kantonalno</option>
                            <option value="Općinsko">Općinsko</option>
                        </select>
                        <select {...register('ack_class_id', { required: true })} className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2">
                            <option value="">Odaberi razred</option>
                            <option value="VIII">VIII</option>
                            <option value="IX">IX</option>
                        </select>
                        <select {...register('ack_position', { required: true })} className="w-full border border-gray-300 rounded-md mb-2 px-4 py-2">
                            <option value="">Odaberi osvojeno mjesto</option>
                            <option value="1">1. mjesto</option>
                            <option value="2">2. mjesto</option>
                            <option value="3">3. mjesto</option>
                        </select>
                        {alreadyExists && (
                            <div className="flex justify-center items-center">
                                <p className="text-red-500 text-xs mb-2">Takmičenje se ne može dodati jer već postoji za taj nivo i razred!</p>
                            </div>
                        )}
                        <div className="flex justify-center pt-4">
                        <button type="submit" className="w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2">Sačuvaj</button>
                        <button type="button" onClick={() => setShowPoints(prevState => !prevState)} className="w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2">Bodovanje</button>
                        <button type="button" onClick={() => setShowForm(false)} className="w-40 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-lg">Otkaži</button>
                        </div>
                        {/* Here we are displaying the points dropdown */}
                        <div className="flex justify-center">
                        {showPoints && (
                            <div className="mt-4">
                                <h2 className=" text-lg font-semibold mb-2"></h2>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <h3 className="text-md font-semibold mb-2">Federalno</h3>
                                        <p>1. mjesto - 5b</p>
                                        <p>2. mjesto - 4b</p>
                                        <p>3. mjesto - 3b</p>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-semibold mb-2">Kantonalno</h3>
                                        <p>1. mjesto - 4b</p>
                                        <p>2. mjesto - 3b</p>
                                        <p>3. mjesto - 2b</p>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-semibold mb-2">Općinsko</h3>
                                        <p>1. mjesto - 3b</p>
                                        <p>2. mjesto - 2b</p>
                                        <p>3. mjesto - 1b</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        </div>
                    </form>
                </div>
              </div>
            )}
            {/* The acknowledgment table renders if there already are acknowledgments; */}
            {editingStudent !== null && editingStudent.length > 0 && !showForm && (
                <div className="full-w overflow-x-auto mt-4 ml-4 mr-4">
                    <table className="min-w-full border border-gray-200 mb-4">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-200">
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Naziv takmičenja</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Nivo takmičenja</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Razred</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Bodovi</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-200">Pozicija</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {editingStudent.map((ack) => (
                                <tr key={ack.id}>
                                    <td className="px-6 py-4 text-center border-r border-gray-200">{ack.ack_name}</td>
                                    <td className="px-6 py-4 text-center border-r border-gray-200">{ack.ack_level}</td>
                                    <td className="px-6 py-4 text-center border-r border-gray-200">{ack.ack_class_id}</td>
                                    <td className="px-6 py-4 text-center border-r border-gray-200">{ack.ack_points}</td>
                                    <td className="px-6 py-4 text-center border-r border-gray-200">{ack.ack_position}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Here we render a button to open the acknowledgment form; */}
                    <div className="flex justify-center pt-4">
                        <button onClick={() => setShowForm(true)} className="w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2">Dodaj takmičenje</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcknowledgmentForm;
