import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ConfirmationModal from "../delete/confirmationModal";
import EditTeacherPage from "../../../pages/admin/editTeacher/[id]";
import EditTeacher from "./editTeacher";
import Link from 'next/link';
import Url from "../../../constants";
import useIsTablet from "../home/useIsTablet";

const ListTeachers = () => {
    const { status, data } = useSession();
    console.log("🚀 ~ file: listTeachers.js:6 ~ ListTeachers ~ data", data)
    const [teachers, setTeachers] = useState([])
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    const isTablet = useIsTablet();

    async function getTeachers(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/teachers/teacher-list/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            })
            const teachersData = await resp.json();
            console.log("🚀 ~ file: listTeachers.js:17 ~ getTeachers ~ teachersData", teachersData)
            setTeachers(teachersData)
        } catch (e) {
            console.log(e)
        }
    }
    // Function for deleting teachers;
    async function deleteTeacher(id) {
        try {
            const resp = await fetch(`${Url}api/teachers/teacher/${id}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${data.user.token}`
                }
            });
            if (resp.ok) {
                setTeachers(teachers.filter(teacher => teacher.id !== id));
            } else {
                console.error('Failed to delete teacher!');
            }
        } catch (error) {
            console.error('Error deleting teacher:', error);
        }
    }

    useEffect(() => {
        if (data) {
            getTeachers(data)
        }
    }, [data])

    return (
        <div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3">Lista nastavnika</h1>
                {!isTablet && (
                    <div className="mt-3 mb-3 flex">
                        <dt className="text-gray-700 ml-5 font-bold min-w-[12rem]">Ime i prezime</dt>
                        <dt className="text-gray-700 font-bold min-w-[14rem]">Email</dt>
                        <dt className="text-gray-700 font-bold">Škola</dt>
                    </div>
                    )}
                    {isTablet && (
                    <div className="mt-3 mb-3 flex">
                        <dt className="text-gray-700 ml-5 font-bold min-w-[10rem]">Ime i prezime</dt>
                        <dt className="text-gray-700 font-bold min-w-[11rem]">Email</dt>
                        <dt className="text-gray-700 font-bold">Škola</dt>
                    </div>
                    )}
                {teachers.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {teachers.map((item, index) => (
                                <div key={index} className="py-4 sm:grid sm:grid-cols-5 sm:gap-4 sm:py-5 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.first_name} {item.last_name}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">{item.email}</dd>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0 ml-10">{item.school_id.school_name}</dd>
                                    {/* Instead of a button we are using a link */}
                                    <Link href={`/admin/editTeacher/${item.id}`} passHref>
                                        <div className="mt-1 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg ml-2" style={{ alignSelf: 'center', width: '100px', marginLeft: '80px' }}>Uredi</div>
                                    </Link> 
                                    <button onClick={() => {
                                        setTeacherToDelete(item);
                                        setShowDeleteModal(true);
                                    }} className={`mt-1 text-sm text-white bg-red-500 sm:col-span-1 px-4 py-2 hover:bg-red-600 rounded-md shadow-lg ${isTablet ? 'ml-12' : 'ml-4'}`} style={{ alignSelf: 'center', width: '100px' }}>Izbriši</button>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
            {/* Render the delete modal */}
            {showDeleteModal && (
                <ConfirmationModal
                    message="Da li ste sigurni da želite izbrisati ovog nastavnika?"
                    onConfirm={() => {
                        deleteTeacher(teacherToDelete.id);
                        setShowDeleteModal(false);
                    }}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
   }

export default ListTeachers;