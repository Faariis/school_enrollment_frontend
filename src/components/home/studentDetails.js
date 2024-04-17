import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const StudentDetails = ({  studentId, courseId }) => {
    const router = useRouter();
    const { data } = useSession();
    const [student, setStudent] = useState(null);
    const [averageScores, setAverageScores] = useState(null);
    const [specialScores, setSpecialScores] = useState(null);
    const [acknowledgmentPoints, setAcknowledgementPoints] = useState(null);
    const [sv, setSV] = useState(null);
    const [sv2, setSV2] = useState(null);
    const [sv3, setSV3] = useState(null);
    const [total, setTotal] = useState(null);

    // Here we get the student using his id;
    async function getStudent(dataInfo) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student-list/${studentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': dataInfo ? `Bearer ${dataInfo.user.token}` : null
                }
            });
            const studentData = await resp.json();
            const desiredCourseA = studentData.desired_course_A;
            getSpecialScores(studentId, desiredCourseA);
            getTotalPoints(studentId, desiredCourseA);
            setStudent(studentData);
        } catch (e) {
            console.log(e);
        }
    }

    // Getting the average score per grade (VI, VII, VIII, IX);
    async function getAverageScorePerGrade(studentId) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/average/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            const scoresData = await resp.json();
            const averageScoresPerGrade = {
                VI: scoresData.average_VI,
                VII: scoresData.average_VII,
                VIII: scoresData.average_VIII,
                IX: scoresData.average_IX,
            };
            setSV(scoresData.points)
            setAverageScores(averageScoresPerGrade);
        } catch (e) {
            console.log(e);
        }
    }

    /*
    NOTE: In the get student I declared the const desiredCourseA to get the desired_course_A (course code)
    of the student, I tried passing the courseId from the listStudentsPerCourse.js but it does not work so
    I had to use this alternative approach;
    */
    // Getting the special criteria grades per desired_course_code and their sum;
    async function getSpecialScores(studentId, desiredCourseA) {
        try {
            const resp = await fetch(`http://127.0.0.1:8000/api/sec-students/student/${studentId}/special-courses/${desiredCourseA}/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            const scoresData = await resp.json();
            const specialScoresData = scoresData.map(courseData => {
                const { ...rest } = courseData;
                return rest;
            });
            const totalPoints = specialScoresData.reduce((acc, courseData) => acc + courseData.total_special_points, 0);
            setSpecialScores(specialScoresData);
            setSV2(totalPoints);
        } catch (e) {
            console.log(e);
        }
    }

    // Getting the points for acknowledgments;
    async function getAcknowledgmentPoints(studentId) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/acknowledgmentsPoints/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            const acknowledgmentData = await resp.json();
            const acknowledgmentPointsPerLevel = {
                O: acknowledgmentData.total_district_points,
                K: acknowledgmentData.total_canton_points,
                F: acknowledgmentData.total_federal_points,
            };
            setSV3(acknowledgmentData.total_ack_points)
            setAcknowledgementPoints(acknowledgmentPointsPerLevel);
        } catch (e) {
            console.log(e);
        }
    }

// Getting the total points;
    async function getTotalPoints(studentId, desiredCourseA) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/points-summary/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            const summaryPointsData = await resp.json();
            // Filter the summaryPointsData to get the total_points where course === desiredCourseA
            const desiredCourseAPoints = summaryPointsData.find(item => item.course.toUpperCase() === desiredCourseA.toUpperCase());
            if (desiredCourseAPoints) {
                setTotal(desiredCourseAPoints.total_points);
            } else {
                console.log(`No data found for desiredCourseA: ${desiredCourseA}`);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getStudent(data);
        getAverageScorePerGrade(studentId);
        getAcknowledgmentPoints(studentId);
    }, [ studentId ]);


    return (
        <div className="full-w overflow-x-auto">
            <button onClick={() => router.push('/')} className="flex items-center px-2 py-1 rounded-md hover:bg-gray-300 focus:outline-none">
                <ChevronLeftIcon className="w-6 h-6 mr-1" />
            </button>
            <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th colSpan="3" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Generalije</th>
                        {averageScores && Object.keys(averageScores).length > 0 && (
                            <>
                                <th colSpan={Object.keys(averageScores).length + 1} scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">I-Opšti kriterij - USPJEH VI - IX O.Š. x3</th>
                                <th colSpan="7" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">II-Posebni kriterij - RELEVANTNI NASTAVNI PREDMETI</th>
                                <th colSpan="4" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">III-Specijalni kriterij - TAKMIČENJE VIII i IX RAZRED</th>
                            </>
                        )}
                    </tr>
                    <tr>
                        {['Ime i prezime', 'Status', 'Osnovna škola', ...Object.keys(averageScores || {}), 'SV (Opšti kriterij)', ...specialScores?.length > 0 ? Object.keys(specialScores[0]).filter(key => key !== 'course' && key !== 'total_special_points').map(key => `${key}`) : [], 'SV (posebni kriterij)', 'O', 'K', 'F', 'SV (specijalni kriterij)', 'Ukupno'].map(header => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        {[`${student?.name} ${student?.last_name}`, student?.special_case, student?.primary_school, ...(Object.values(averageScores || {})), sv, ...specialScores?.length > 0 ? Object.values(specialScores[0]).filter((_, index) => index !== 0 && index !== Object.values(specialScores[0]).length - 1) : [], sv2, ...(Object.values(acknowledgmentPoints || {})), sv3, total].map((value, index) => (
                            <td key={index} className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200">{value}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default StudentDetails;
