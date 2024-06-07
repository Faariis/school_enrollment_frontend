import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";
import { PupilLimit } from "../../../constants";
import Link from "next/link";
import useIsMobile from "./useIsMobile";
import useIsTablet from "./useIsTablet";
import useIsMiniMobile from "./useIsMiniMobile";
import useIsMiniTablet from "./useIsMiniTablet";

const ListStudents = () => {
    const { data } = useSession();
    const [studentsData, setStudentsData] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [loading, setLoading] = useState(false); // State for loading indicator
    const [error, setError] = useState('');
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isMiniMobile = useIsMiniMobile();
    const isMiniTablet = useIsMiniTablet();

    const getStudentPoints = async (name) => {
        try {
            setLoading(true); // Set loading to true when fetching data
            const resp = await fetch(`${Url}api/sec-students/student-list/1/student/points-summary-all-courses/${name}/`, {
                method: 'GET',
            });
            if (resp.status === 404) {
                setStudentsData(null);
                setError('Učenik nije upisan.');
            } else {
                const studentData = await resp.json();
                if (studentData && studentData.length > 0) {
                    setStudentsData(studentData);
                    setError('');
                } else {
                    setError('Podaci o učenicima nisu pronađeni.');
                    setStudentsData(null);
                }
            }
        } catch (e) {
            console.log(e);
            setError('Učenik sa tim imenom ili prezimenom nije upisan.');
        } finally {
            setLoading(false); // Set loading to false when done fetching data
        }
    };


    const handleInputChange = (event) => {
        setNameInput(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleShowPoints();
        }
    };

    const handleShowPoints = () => {
        if (nameInput.trim() !== '') {
            getStudentPoints(nameInput);
        }
    };

    const handleToggleExpand = (index) => {
        // If the clicked student index is the same as the selected student index;
        // toggle the showAllCourses state, otherwise, set the showAllCourses state to true for the clicked student;
        setShowAllCourses(prev => selectedStudentIndex === index ? !prev : true);
        setSelectedStudentIndex(index);
    };

    const handleShowAllCourses = () => {
        setShowAllCourses(prev => !prev);
    };

    const PupilLimit = 23;

    return (
        <div>
            <div className="flex justify-center" style={{ paddingBottom: '40px' }}>
                <h1 className="text-3xl font-semibold text-center ml-2 mr-2">Dobrodošli na upis učenika u Tehničku školu 2024/2025</h1>
            </div>
            <div className="flex flex-col">
                <div className="mb-4">
                    <div className="flex mt-10 ml-1">
                        <input
                            id="nameInput"
                            type="text"
                            className="border rounded w-full py-2 px-3"
                            value={nameInput}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Unesite ime i/ili prezime"
                        />
                        <button className="ml-1 mr-1 text-sm font-bold text-white bg-gray-600 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg" onClick={handleShowPoints} disabled={loading}>
                            Prikaži
                        </button>
                    </div>
                    {studentsData && studentsData.length > 0 && !error && !loading && (
                     <div className="mt-3 flex">
                         <dt className={`${!isMobile && !isTablet && !isMiniTablet ? 'text-gray-700 font-bold ml-5 min-w-[19rem]' : isTablet ? 'text-gray-700 font-bold ml-10 min-w-[14rem]' : isMiniTablet ? 'text-gray-700 font-bold ml-5 mr-9' : isMiniMobile ? 'text-gray-700 font-bold ml-1' : 'text-gray-700 font-bold ml-2 mr-4'} ${isMobile ? 'text-xs' : ''}`}>Ime i prezime</dt>
                         <dt className={`${!isMobile && !isTablet && !isMiniTablet ? 'text-gray-700 font-bold min-w-[17rem]' : isTablet ? 'text-gray-700 font-bold min-w-[14rem]' : isMiniTablet ? 'text-gray-700 font-bold ml-5 mr-9' : isMiniMobile ? 'text-gray-700 font-bold ml-1 mr-1' : 'text-gray-700 font-bold ml-2 mr-4'} ${isMobile ? 'text-xs' : ''}`}>Trenutna pozicija</dt>
                         <dt className={`text-gray-700 font-bold ${isMobile ? 'text-xs' : ''}`}>Smjer</dt>
                      </div>
                 )}
                </div>
                {error === '' && studentsData && !loading && studentsData.map((student, studentIndex) => (
                    <div key={studentIndex} className="rounded-md">
                        {student && student.courses_short_statistics && Object.values(student.courses_short_statistics)
                        .filter(course => course.course_code === student.desired_course_code)
                        .sort((a, b) => b.total_points - a.total_points)
                        .map((course, courseIndex) => (
                            <div key={courseIndex} className={`p-4 my-2 mr-1 ml-1 border-2 border-gray-700 ${course.current_position < PupilLimit ? 'bg-green-100' : 'bg-red-100'}`}>
                               <div className={`grid grid-cols-4 gap-2 items-center ${isMiniMobile ? 'ml-3 mr-3' : ''}`}>
                                    <div className={`${!isMobile ? 'ml-5' : 'mr-4'}`}>
                                        {isMobile && (
                                        <dt className="text-sm font-bold text-gray-900">{`${student.pupil_name}`}</dt>
                                        )}
                                        {isMobile && (
                                        <dt className="text-sm font-bold text-gray-900">{`${studentsData.filter(s => s.pupil_name === student.pupil_name && s.pupil_last_name === student.pupil_last_name).length > 1 ? ` (${student.pupil_guardian_name})` : ''} ${student.pupil_last_name}`}</dt>
                                        )}
                                        {!isMobile && (
                                        <dt className="text-md font-bold text-gray-900">{`${student.pupil_name} ${studentsData.filter(s => s.pupil_name === student.pupil_name && s.pupil_last_name === student.pupil_last_name).length > 1 ? ` (${student.pupil_guardian_name})` : ''} ${student.pupil_last_name}`}</dt>
                                        )}
                                    </div>
                                    <div className={`${!isMobile && !isTablet && !isMiniTablet ? 'text-center ml-20 mr-20 min-w-[6rem]' : isTablet ? 'text-center ml-20 min-w-[6rem]' : isMiniTablet ? 'text-center ml-8' : ''}`}>

                                        <dt className={`text-md font-bold text-gray-900 ${isMobile ? 'ml-5' : ''}`}>{course.current_position}</dt>
                                    </div>
                                    <div className={`flex-grow text-center ${isMiniMobile ? 'ml-4' : isMobile ? '' : 'ml-10'}`}>
                                        <dt className="text-md font-bold text-gray-900">{course.course_code}</dt>
                                    </div>
                                    {(isMobile || isMiniTablet) && (
                                        <div className="text-base ml-auto">
                                            <div className="text-base flex items-center">
                                                <button className={`text-xs mb-1 font-bold text-white bg-gray-600 px-2 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg mr-1 ${isMobile ? 'ml-5' : ''}`} onClick={() => handleToggleExpand(studentIndex)}>
                                                    {showAllCourses && selectedStudentIndex === studentIndex ? 'Sakrij' : 'Uporedi'}
                                                </button>
                                            </div>
                                            <div>
                                                <Link href={`/home/${course.course_code}/${student.pupil_id}`} passHref>
                                                    <button className={`text-xs font-bold text-white bg-gray-600 px-3 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg ${isMobile ? 'px-2 py-1 ml-5 mt-1 ' : 'px-4 py-2'}`}>
                                                        Detalji
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                    {(!isMobile && !isMiniTablet) && (
                                        <div className="text-base ml-auto">
                                            <div className="text-base flex items-center">
                                                <button className="text-sm font-bold text-white bg-gray-600 px-3 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg mr-1" onClick={() => handleToggleExpand(studentIndex)}>
                                                    {showAllCourses && selectedStudentIndex === studentIndex ? 'Sakrij' : 'Komparacija'}
                                                </button>
                                                <Link href={`/home/${course.course_code}/${student.pupil_id}`} passHref>
                                                    <button className={`text-sm font-bold text-white bg-gray-600 px-3 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg ${isMobile ? 'px-2 py-1' : 'px-4 py-2'}`}>
                                                        Detalji
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {showAllCourses && selectedStudentIndex === studentIndex && Object.values(student.courses_short_statistics)
                            .filter(course => course.course_code !== student.desired_course_code)
                            .sort((a, b) => b.total_points - a.total_points)
                            .map((course, courseIndex) => (
                                <div key={courseIndex} className={`p-4 my-2 mr-1 ml-1 border border-gray-300 ${course.current_position < PupilLimit ? 'bg-green-100' : 'bg-red-100'}`}>
                                    <div className={`grid grid-cols-4 gap-2 items-center ${isMiniMobile ? 'ml-3' : ''}`}>
                                        <div className={`${!isMobile ? 'ml-5 mr-10' : 'mr-9'}`}>
                                        {isMobile && (
                                        <dt className="text-sm text-gray-900">{`${student.pupil_name}`}</dt>
                                        )}
                                        {isMobile && (
                                        <dt className="text-sm text-gray-900">{`${studentsData.filter(s => s.pupil_name === student.pupil_name && s.pupil_last_name === student.pupil_last_name).length > 1 ? ` (${student.pupil_guardian_name})` : ''} ${student.pupil_last_name}`}</dt>
                                        )}
                                        {!isMobile && (
                                        <dt className="text-md text-gray-900">{`${student.pupil_name} ${studentsData.filter(s => s.pupil_name === student.pupil_name && s.pupil_last_name === student.pupil_last_name).length > 1 ? ` (${student.pupil_guardian_name})` : ''} ${student.pupil_last_name}`}</dt>
                                        )}
                                        </div>
                                        <div className={`${!isMobile && !isTablet ? 'text-center ml-8 min-w-[6rem]' : isTablet ? 'text-center ml-20 min-w-[6rem]' : 'ml-5'}`}>
                                            <dt className="text-md text-gray-700">{course.current_position}</dt>
                                        </div>
                                        <div className={`flex-grow text-center ${isMiniMobile ? '' : isMobile ? '' : 'ml-12'}`}>
                                            <dt className="text-md text-gray-700">{course.course_code}</dt>
                                        </div>
                                        <div className="text-base ml-auto">
                                            <Link href={`/home/${course.course_code}/${student.pupil_id}`} passHref>
                                                <button className={`text-xs font-bold text-white bg-gray-600 px-3 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg mt-2 sm:mt-0 ${isMobile ? 'px-2 py-1' : 'px-4 py-2'}`}>
                                                    Detalji
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ))}
                {/* Loading indicator */}
                {loading && <p className="text-center font-bold">Loading...</p>}
                {!loading && error !== '' && <p className="flex-grow text-center font-bold text-red-500">{error}</p>}
            </div>
        </div>
    );
}

export default ListStudents;