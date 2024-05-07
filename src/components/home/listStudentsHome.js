import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";
import Link from "next/link";
import useIsMobile from "./useIsMobile";

const ListStudents = () => {
    const { data } = useSession();
    const [studentsData, setStudentsData] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAllCourses, setShowAllCourses] = useState(false);
    const [selectedStudentIndex, setSelectedStudentIndex] = useState(null);
    const isMobile = useIsMobile();

    const getStudentPoints = async (name) => {
        try {
            setLoading(true);
            const resp = await fetch(`${Url}api/sec-students/student-list/1/student/points-summary-all-courses/${name}/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
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
            setLoading(false);
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
    
    console.log(studentsData)

    const handleToggleExpand = (index) => {
        // If the clicked student index is the same as the selected student index;
        // toggle the showAllCourses state, otherwise, set the showAllCourses state to true for the clicked student;
        setShowAllCourses(prev => selectedStudentIndex === index ? !prev : true);
        setSelectedStudentIndex(index);
    };

    const handleShowAllCourses = () => {
        setShowAllCourses(prev => !prev);
    };

    return (
        <div>
            <div className="flex justify-center" style={{ paddingBottom: '40px' }}>
                <h1 className="text-4xl font-semibold text-center">Dobrodošli</h1>
            </div>
            <div className="flex flex-col">
                <div className="mb-4">
                    <label htmlFor="courseInput" className="block text-sm font-bold mb-2 ml-3">Unesite ime i prezime učenika:</label>
                    <div className="flex">
                        <input
                            id="nameInput"
                            type="text"
                            className="border rounded w-full py-2 px-3"
                            value={nameInput}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Unesi ime i prezime"
                        />
                        <button className="ml-1 text-sm font-bold text-white bg-gray-600 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg" onClick={handleShowPoints} disabled={loading}>
                            Prikaži
                        </button>
                    </div>
                </div>
                {error === '' ? (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {studentsData && studentsData.map((student, studentIndex) => {
                                // Check if there are duplicates of the current student's name and last name in the studentsData array
                                const hasDuplicateNames = studentsData.filter(s => s.pupil_name === student.pupil_name && s.pupil_last_name === student.pupil_last_name).length > 1;
                                const courseStatistics = Object.values(student.courses_short_statistics).filter(course => course.course_code === student.desired_course_code);
                                return (
                                    <div key={studentIndex} className="rounded-md p-1 my-2">
                                        {isMobile && (
                                            <div className="flex items-start mb-1">
                                                <div className="flex-grow">
                                                    <div>
                                                        <dt className="text-base text-lg">{student.pupil_name}</dt>
                                                        <dt className="text-base text-lg">{hasDuplicateNames && `(${student.pupil_guardian_name})`} {student.pupil_last_name}</dt>
                                                    </div>
                                                </div>
                                                <div className="mr-4">
                                                    <div className="text-base font-bold mr-5">Pozicija:</div>
                                                    <dt className="text-base text-lg ml-4">{courseStatistics.length > 0 && courseStatistics[0].current_position}</dt>
                                                </div>
                                                <div className="flex-grow mr-4">
                                                    <div className="text-base font-bold">Smjer:</div>
                                                    <dt className="text-base text-lg">{student.desired_course_code}</dt>
                                                </div>
                                                <div>
                                                    <button className="mt-2 text-sm font-bold text-white bg-gray-600 px-3 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg" onClick={() => handleToggleExpand(studentIndex)}>
                                                        {showAllCourses && selectedStudentIndex === studentIndex ? <>&#8592;</> : 'Smjerovi'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {!isMobile && (
                                        <div className="flex items-start mb-3">
                                            <div className="ml-7 flex-grow">
                                                <div className="text-base font-bold">Ime i prezime:</div>
                                                {/* Render guardian_name only if there are duplicate names and last names */}
                                                <dt className="text-base text-lg">{student.pupil_name} {hasDuplicateNames && `(${student.pupil_guardian_name})`} {student.pupil_last_name}</dt>
                                            </div>
                                            <div className="mr-20 flex-grow">
                                                <div className="text-base font-bold">Pozicija:</div>
                                                <dt className="text-base text-lg ml-5">{courseStatistics.length > 0 && courseStatistics[0].current_position}</dt>
                                            </div>
                                            <div className="flex-grow">
                                                <div className="text-base font-bold">Smjer:</div>
                                                <dt className="text-base text-lg">{student.desired_course_code}</dt>
                                            </div>
                                            <div className="ml-auto">
                                                <button className="text-md font-bold text-white bg-gray-600 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg" onClick={() => handleToggleExpand(studentIndex)}>
                                                    {showAllCourses && selectedStudentIndex === studentIndex ? <>&#8592;</> : 'Smjerovi'}
                                                </button>
                                            </div>
                                        </div>
                                        )}
                                        {showAllCourses &&
                                            selectedStudentIndex === studentIndex &&
                                            Object.values(student.courses_short_statistics)
                                                .sort((a, b) => b.total_points - a.total_points)
                                                .map((course, courseIndex) => (
                                                    <div key={courseIndex} className={`p-4 my-2 border border-gray-300 ${course.course_code === student.desired_course_code ? 'border-gray-600 border-[2px]' : 'border-gray-300'} ${course.current_position < 23 ? 'bg-green-100' : 'bg-red-100'}`}>
                                                        <div className="flex items-center">
                                                            {isMobile && (
                                                                <>
                                                                    <div className="mr-12">
                                                                        <div className="text-md text-gray-700">{student.pupil_name}</div>
                                                                        <div className="text-md text-gray-700">{hasDuplicateNames && `(${student.pupil_guardian_name})`} {student.pupil_last_name}</div>
                
                                                                    </div>
                                                                    <div className="mr-14">
                                                                        <div className="text-md text-gray-700">{course.current_position}</div>
                                                                    </div>
                                                                    <div className="flex-grow mr-3">
                                                                        <div className="text-md text-gray-700">{student.desired_course_code}</div>
                                                                    </div>
                                                                </>
                                                            )}
                                                            {!isMobile && (
                                                                <>
                                                                    <div className="ml-5 mr-10">
                                                                        <dt className="text-md  text-gray-700">{student.pupil_name} {hasDuplicateNames && `(${student.pupil_guardian_name})`} {student.pupil_last_name}</dt>
                                                                    </div>
                                                                    <div className="text-center ml-20 mr-20" style={{ minWidth: '11rem' }}>
                                                                        <dt className="text-md  text-gray-700">{course.current_position}</dt>
                                                                    </div>
                                                                    <div className="flex-grow text-center">
                                                                        <dt className="text-base text-md  text-gray-700">{course.course_code}</dt>
                                                                    </div>
                                                                </>
                                                            )}
                                                            <div className="text-base ml-auto">
                                                                <Link href={`/home/${course.course_code}/${student.pupil_id}`} passHref>
                                                                    <button className={`text-sm font-bold text-white bg-gray-600 px-3 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg mt-2 sm:mt-0 ${isMobile ? 'px-2 py-1' : 'px-4 py-2'}`}>
                                                                        Detalji
                                                                    </button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                    </div>
                                );
                            })}
                        </dl>
                    </div>
                ) : (
                    <p className="flex-grow text-center font-bold text-red-500">{error}</p>
                )}
            </div>
        </div>
    );
}

export default ListStudents;
