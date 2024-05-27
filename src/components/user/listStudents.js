import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";
import ConfirmationModal from "../delete/confirmationModal";
import Link from "next/link";
import useIsTablet from "../home/useIsTablet";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const ListStudents = () => {
    const { status, data } = useSession();
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    const [searchInput, setSearchInput] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [totalRecords, setTotalRecord] = useState(0);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [isStudentsFetched, setIsStudentsFetched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const studentsPerPage = 10; // Assuming you have 10 students per page
    const isTablet = useIsTablet();

    async function getCourses(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/sec-schools/school-list/1/courses/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            });
            const coursesData = await resp.json();
            setCourses(coursesData);
        } catch (e) {
            console.log(e);
        }
    }

    async function getStudents(dataInfo, pageUrl) {
        try {
            const resp = await fetch(pageUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            });
            const responseData = await resp.json();
            const totalPupils = responseData.count;
            const studentsArray = responseData.results;
            setTotalRecord(totalPupils);
            setStudents(studentsArray);
            setNextPageUrl(responseData.next);
            setPrevPageUrl(responseData.previous);
        } catch (e) {
            console.log(e);
        }
    }

    async function deleteStudent(id) {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list/${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${data.user.token}`,
                },
            });
            if (resp.ok) {
                setStudents(students.filter((student) => student.pupil_id !== id));
                if (filteredStudents.length === 1 && currentPage > 1) {
                    loadPreviousPage();
                } else {
                    getStudents(data, `${Url}api/sec-students/student-list/1/student2/?page=${currentPage}`);
                }
            } else {
                console.error("Failed to delete student!");
            }
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    }

    useEffect(() => {
        if (data && !isStudentsFetched) {
            getCourses(data);
            getStudents(data, `${Url}api/sec-students/student-list/1/student2/?page=1`);
            setIsStudentsFetched(true);
        }
    }, [data, isStudentsFetched]);

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    const filteredStudents = students?.filter(student => {
        const fullName = `${student.last_name} ${student.name}`.toLowerCase();
        const reversedFullName = `${student.name} ${student.last_name}`.toLowerCase();
        const searchQuery = searchInput.toLowerCase();
    
        if (fullName.includes(searchQuery) || reversedFullName.includes(searchQuery)) {
            return true;
        }
    
        const lastNameMatch = student.last_name.toLowerCase().includes(searchQuery);
        const firstNameMatch = student.name.toLowerCase().includes(searchQuery);
        return lastNameMatch || firstNameMatch;
    })?.filter(student => {
        if (selectedCourse !== "") {
            return student.desired_course_A === selectedCourse;
        } else {
            return true;
        }
    }) ?? [];

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    const loadNextPage = () => {
        const nextPageNumber = currentPage + 1;
        const nextPageUrl = `${Url}api/sec-students/student-list/1/student2/?page=${nextPageNumber}`.replace("http://", "https://");
        getStudents(data, nextPageUrl);
        setCurrentPage(nextPageNumber);
    };

    const loadPreviousPage = () => {
        const prevPageNumber = currentPage - 1;
        const prevPageUrl = `${Url}api/sec-students/student-list/1/student2/?page=${prevPageNumber}`.replace("http://", "https://");
        getStudents(data, prevPageUrl);
        setCurrentPage(prevPageNumber);
    };

    const startIndex = (currentPage - 1) * studentsPerPage;

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold mb-3">Lista učenika</h1>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Unesite ime i/ili prezime"
                            className="ml-3 px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <select
                            className="ml-3 px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
                            value={selectedCourse}
                            onChange={handleCourseChange}>
                            {courses.length > 0 ? (
                                <>
                                    <option value="">Svi smjerovi</option>
                                    {courses.map(course => (
                                        <option key={course._course_code} value={course._course_code}>{course._course_code}</option>
                                    ))}
                                </>
                            ) : (
                                <option value="">Nema dostupnih smjerova</option>
                            )}
                        </select>
                    </div>
                </div>
                {filteredStudents.length > 0 ? (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {!isTablet && (
                                <div className="mt-3 mb-3 flex">
                                    <dt className="text-gray-700 ml-5 font-bold min-w-[11rem]">Ime i prezime</dt>
                                    <dt className="text-gray-700 font-bold min-w-[8rem]">Email</dt>
                                    <dt className="text-gray-700 font-bold min-w-[9rem]">Smjer</dt>
                                    <dt className="text-gray-700 font-bold min-w-[9rem]">Telefon</dt>
                                    <dt className="text-gray-700 font-bold">Datum upisa</dt>
                                </div>
                            )}
                            {isTablet && (
                                <div className="mt-3 mb-3 flex">
                                    <dt className="text-gray-700 ml-5 font-bold min-w-[10rem]">Ime i prezime</dt>
                                    <dt className="text-gray-700 font-bold min-w-[6rem]">Email</dt>
                                    <dt className="text-gray-700 font-bold min-w-[6rem]">Smjer</dt>
                                    <dt className="text-gray-700 font-bold min-w-[6rem]">Telefon</dt>
                                    <dt className="text-gray-700 font-bold">Datum upisa</dt>
                                </div>
                            )}
                            {filteredStudents.map((item, index) => {
                                return (
                                    <div
                                        key={item.id}
                                        className="py-4 sm:grid sm:grid-cols-7 sm:gap-6 sm:py-5 sm:px-6"
                                    >
                                        <dt className="sm:col-span-1 text-sm font-medium text-gray-500 first-letter:capitalize sm:mt-2">
                                            {startIndex + index + 1}. {item.name} {item.last_name}
                                        </dt>
                                        <dd className="text-sm text-gray-900 sm:col-span-1 sm:mt-2">
                                            {item.email}
                                        </dd>
                                        <dd className="text-sm text-gray-900 sm:col-span-1 sm:mt-2 ml-10">
                                            {item.desired_course_A}
                                        </dd>
                                        <dd className="text-sm text-gray-900 sm:col-span-1 sm:mt-2 ml-2">
                                            {item.phone_number}
                                        </dd>
                                        <dd className={`text-sm text-gray-900 sm:col-span-1 sm:mt-2 ${isTablet ? "sm:ml-3" : "sm:ml-10"}`}>
                                            {item.date_of_enrollment}
                                        </dd>
                                        <div className="flex items-center">
                                        <Link href={`/user/pupils/${item.id}/edit`} passHref>
                                            <div
                                                className="mt-1 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg ml-2"
                                                style={{
                                                    alignSelf: "center",
                                                    width: "80px",
                                                    minWidth: "70px",
                                                    marginLeft: "40px",
                                                }}
                                            >
                                                Uredi
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setStudentToDelete(item);
                                                setShowDeleteModal(true);
                                            }}
                                            className={`mt-1 text-sm text-white bg-red-500 sm:col-span-1 px-4 py-2 hover:bg-red-600 rounded-md shadow-lg ${isTablet ? 'ml-8' : 'ml-4'}`}
                                            style={{ alignSelf: "center", width: "70px", minWidth: "80px" }}
                                        >
                                            Izbriši
                                        </button>
                                    </div>
                                    </div>
                                );
                            })}
                        </dl>
                    </div>
                ) : (
                    <div className="text-center font-bold text-red-500 mt-4">
                        {filteredStudents.length === 0 ? "Nema učenika koji odgovaraju pretrazi." : "Učitavanje učenika..."}
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-4">
            <div>
        <button
            onClick={loadPreviousPage}
            disabled={!prevPageUrl}
            className="ml-10 text-sm text-white bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            <FaArrowLeft className="w-4 h-4" />
        </button>
    </div>
    <div className="mt-1 inline-block">
        {currentPage > 1 && (
            <button
                onClick={loadPreviousPage}
                className="text-sm mr-2 px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-600 hover:text-white"
            >
                {currentPage - 1}
            </button>
        )}
        <button
            className={`text-sm mr-2 px-2 py-1 rounded-md bg-gray-500 text-white`}
        >
            {currentPage}
        </button>
        {currentPage < Math.ceil(totalRecords / studentsPerPage) && (
            <button
                onClick={loadNextPage}
                className="text-sm mr-2 px-2 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-600 hover:text-white"
            >
                {currentPage + 1}
            </button>
        )}
    </div>
    <div>
        <button
            onClick={loadNextPage}
            disabled={!nextPageUrl}
            className="mr-10 text-sm text-white bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
            <FaArrowRight className="w-4 h-4" />
        </button>
    </div>
        </div>
            {showDeleteModal && (
                <ConfirmationModal
                    show={showDeleteModal}
                    onConfirm={() => {
                        deleteStudent(studentToDelete.id);
                        setShowDeleteModal(false);
                    }}
                    onCancel={() => setShowDeleteModal(false)}
                    title="Potvrda brisanja"
                    message={`Jeste li sigurni da želite izbrisati učenika ${studentToDelete.name} ${studentToDelete.last_name}?`}
                />
            )}
        </div>
    );
};

export default ListStudents;
