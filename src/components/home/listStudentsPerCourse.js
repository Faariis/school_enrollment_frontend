import { useEffect, useState } from "react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ListStudentsPerCourse = ({ courseId }) => {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [searchInput, setSearchInput] = useState("");

    async function getStudents(courseId) {
        try {
            const studentsData = await getAllStudents(courseId);
            setStudents(studentsData);
        } catch (e) {
            console.error("Error fetching student data:", e);
        }
    }

    useEffect(() => {
        getStudents(courseId);
    }, [courseId]);

    // Using this function we can navigate back to the start screen
    const back = () => {
        router.push('/');
    };

    // Function to handle search input change
    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };   

    // Filter students based on search input
    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    console.log(filteredStudents[0])

    const goToDetails = (item) => {
        try {
            localStorage.setItem('lastSelectedItem', JSON.stringify(item));
            router.push(`/home/${courseId}/${item.id}`);
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    };    

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <h1 className="ml-3 text-2xl font-semibold">Lista učenika {courseId}</h1>
                    <div className="flex items-center pb-2">
                        <Link href={`/home/${courseId}/table`} passHref>
                            <div className="mr-2 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg table-btn">
                                Tabelarni prikaz
                            </div>
                        </Link>
                        <input
                            type="text"
                            placeholder="Pretraga"
                            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <button className="ml-3 mb-2 flex items-center px-2 py-1 boarder none" onClick={back}>
                            <ChevronLeftIcon className="w-6 h-6 mr-1" />
                        </button>
                    </div>
                </div>
                {filteredStudents.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {filteredStudents.map((item, index) => (
                                <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.name} {item.last_name}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Bodovi: {item.total_points}</dd>
                                    <div onClick={() => goToDetails(item)}>
                                        Detalji
                                   </div>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
};

// Function to retrieve all students
export const getAllStudents = async (courseId) => {
    try {
        const resp = await fetch(`${Url}api/sec-students/student-list/1/${courseId}/1/10/`, {
            method: 'GET',
        });
        const studentsData = await resp.json();

        console.log("studentsData:", studentsData);

        const extractedStudents = [];

        const studentEntries = Object.values(studentsData).filter(entry => Array.isArray(entry));

    
    for (const studentEntry of studentEntries) {
        const student = {
            // [0];
            id: studentEntry[0]?.pupil_id || null,
            name: studentEntry[0]?.pupil_name || "",
            last_name: studentEntry[0]?.pupil_last_name || "",
            middle_name: studentEntry[0]?.pupil_middle_name || "",
            primary_school: studentEntry[0]?.pupil_primary_school || "",
            status: studentEntry[0]?.pupil_status || "",
            desired_course: studentEntry[0]?.pupil_desired_course || "",
            // [1];
            total_points: studentEntry[1]?.total_score || 0,
            // Statictics array [2][0];
            average_VI: studentEntry[2]?.statistics[0]?.average_VI || 0,
            average_VII: studentEntry[2]?.statistics[0]?.average_VII || 0,
            average_VIII: studentEntry[2]?.statistics[0]?.average_VIII || 0,
            average_IX: studentEntry[2]?.statistics[0]?.average_IX || 0,
            points: studentEntry[2]?.statistics[0]?.points || 0,
            // Total special points [2][1];
            total_special_points: studentEntry[2]?.statistics[1]?.total_special_points || 0,
            // Acknowledgments [2][2];
            total_federal_points: studentEntry[2]?.statistics[2]?.acknowledgments?.total_federal_points || 0,
            total_canton_points: studentEntry[2]?.statistics[2]?.acknowledgments?.total_canton_points || 0,
            total_district_points: studentEntry[2]?.statistics[2]?.acknowledgments?.total_district_points || 0,
            total_ack_points: studentEntry[2]?.statistics[2]?.acknowledgments?.total_ack_points || 0,
            // Special courses grades [2][1];
            sc_per_grade: studentEntry[2]?.statistics[1]?.sc_per_grade || null,
        };

        // Extracting special courses grade data;
        const scPerGrade = studentEntry[2]?.statistics[1]?.sc_per_grade || [];
        const formattedScPerGrade = scPerGrade.map(grade => ({
            class_code: grade.class_code || "",
            course_code: grade.course_code || "",
            score: grade.score || 0    
        }));

        student.sc_per_grade = formattedScPerGrade;
    
        extractedStudents.push(student);
    }
    return extractedStudents;
    } catch (e) {
        console.error("Error fetching student data:", e);
        return [];
    }
};

export default ListStudentsPerCourse;
