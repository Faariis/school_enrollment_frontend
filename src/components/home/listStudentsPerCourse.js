import { useEffect, useState } from "react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import useIsMobile from "./useIsMobile";

let filteredStudents;

const ListStudentsPerCourse = ({ courseId }) => {
    const router = useRouter();
    const [allStudents, setStudents] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const [noPerPage, setNoPerPage] = useState(3);
    const [totalRecords, setTotalRecord] = useState(0);
    const isMobile = useIsMobile();

    async function getStudents(courseId) {
        try {
            const studentsData = await getAllStudents(courseId, pageNo, noPerPage);
            console.log("🚀 ~ getStudents ~ studentsData:", studentsData)
            setStudents(studentsData.extractedStudents);
            setTotalRecord(studentsData.totalPupils);
            setPageNo(pageNo+1);
        } catch (e) {
            console.error("Error fetching student data:", e);
        }
    }

    useEffect(() => {
        getStudents(courseId);
    }, [courseId]);

    const back = () => {
        router.push('/');
    };

    const handleSearchInputChange = (event) => {
        setSearchInput(event.target.value);
    };

    let filteredStudents = allStudents.filter(student =>
        student.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchInput.toLowerCase())
    );

    const sortedStudents = [...filteredStudents].sort((a, b) => {
        if (a.status !== 'regular' && b.status === 'regular') {
            return -1;
        } else if (a.status === 'regular' && b.status !== 'regular') {
            return 1;
        } else {
            return b.total_points - a.total_points;
        }
    });

    const loadMoreStudents = async () => {
        const studentsData = await getAllStudents(courseId, pageNo, noPerPage);
        setStudents(prevStudents => [...prevStudents, ...studentsData.extractedStudents]); 
        setPageNo(prevPageNo => prevPageNo + 1);
    }

    return (
        <div>
            {isMobile ? (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <h1 className="ml-3 text-2xl font-semibold">Lista učenika {courseId}</h1>
                        <button className="mr-3 mb-2 flex items-center px-2 py-1 boarder none" onClick={back}>
                            <ChevronLeftIcon className="w-6 h-6 mr-1" />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            placeholder="Pretraga"
                            className="ml-3 px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <Link href={`/home/${courseId}/table`} passHref>
                            <div className="mr-2 text-sm text-black bg-gray-300 sm:col-span-1 px-2 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg table-btn">
                                Tabelarni prikaz
                            </div>
                        </Link>
                    </div>
                </div>
            ) : (
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
                </div>
            )}
            {sortedStudents.length > 0 ? (
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {sortedStudents.map((item, index) => (
                            <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <div className="text-sm font-medium text-gray-500 first-letter:capitalize">
                                        <div>
                                            {index + 1}. {item.name} {item.last_name}
                                        </div>
                                </div>
                                {isMobile && (
                                    <div className="mt-0.5 text-sm text-gray-900 flex justify-between items-center">
                                        <div>
                                            <dt>Bodovi: {item.total_points}</dt>
                                        </div>
                                        <Link href={`/home/${courseId}/${item.id}`} passHref>
                                            <div className="text-sm text-black bg-gray-300 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg" style={{ width: "100px", marginLeft: "10px" }}>
                                                Detalji
                                            </div>
                                        </Link>
                                    </div>
                                )}
                                {!isMobile && (
                                    <div className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                                        Bodovi: {item.total_points}
                                    </div>
                                )}
                                {!isMobile && (
                                    <Link href={`/home/${courseId}/${item.id}`} passHref>
                                        <div className="mt-1 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg ml-2" style={{ alignSelf: "center", width: "100px", marginLeft: "60px" }}>
                                            Detalji
                                        </div>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </dl>
                </div>
            ) : (
                <p className="text-red-500 font-bold mt-3">Trenutno niko nije upisan.</p>
            )}
            
            <div 
                onClick={() => loadMoreStudents()}
                className="flex justify-center items-center h-10 w-40 border mt-20 bg-gray-800 text-white">
                    <span>Učitaj još učenika</span>
                {/* {totalRecords < allStudents.length ? (
                    <span>Učitaj još učenika</span>
                ) : (
                    <span>Nema više</span>
                )}     */}
            </div>
        </div>
    );
};

// Function to retrieve all students
export const getAllStudents = async (courseId, pageNo = 1, noPerPage = 3) => {
    try {
        const resp = await fetch(`${Url}api/sec-students/student-list/1/${courseId}/${pageNo}/${noPerPage}/`, {
            method: 'GET',
        });
        const studentsData = await resp.json();

        const totalPupils = studentsData.total_pupils_on_this_course;

        console.log("studentsData:", studentsData);

        const extractedStudents = [];

        const studentEntries = Object.values(studentsData).filter(entry => Array.isArray(entry));

    
    for (const studentEntry of studentEntries) {
        const student = {
            // [0];
            course_name: studentEntry[0]?.course_name || "",
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
    return {extractedStudents, totalPupils};
    } catch (e) {
        console.error("Error fetching student data:", e);
        return [];
    }
};

export {filteredStudents}

export default ListStudentsPerCourse;
