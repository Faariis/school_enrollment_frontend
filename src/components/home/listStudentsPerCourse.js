import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import Link from "next/link";
import StudentDetails from "./studentDetails";

const ListStudentsPerCourse = ({ courseId }) => {
    const router = useRouter()
    const { data } = useSession();
    const [students, setStudents] = useState([]);

    async function getStudents(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list`, {
                method: 'GET',
                headers: {
                    'Authorization': dataInfo ? `Bearer ${dataInfo.user.token}` : null
                }
            });
            const studentsData = await resp.json();

            // Fetchich total points for each student;
            const studentsWithTotalPoints = await Promise.all(studentsData.map(async (student) => {
                const totalPoints = await getTotalPoints(student.id, student.desired_course_A);
                return { ...student, totalPoints };
            }));

            // Sorting students by total points;
            const sortedStudents = studentsWithTotalPoints.sort((a, b) => b.totalPoints - a.totalPoints);
            setStudents(sortedStudents);
        } catch (e) {
            console.log(e);
        }
    }

    async function getTotalPoints(studentId, desiredCourseA) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/points-summary/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            const summaryPointsData = await resp.json();

            // We need to find the total points for the course;
            const desiredCourseAPoints = summaryPointsData.find(item => item.course.toUpperCase() === desiredCourseA.toUpperCase());
            return desiredCourseAPoints ? desiredCourseAPoints.total_points : 0;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    useEffect(() => {
        getStudents(data);
    }, [courseId]);

    let filteredStudents = students.filter(student => {
        return courseId === student.desired_course_A;
    });

    // Using this function we can navigate back to the start screen;
    const back = () => {
        router.push('/');
    };

    return (
        <div>
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <h1 className="ml-3 text-2xl font-semibold">Lista učenika {courseId}</h1>
                    <button className="ml-3 mb-2 flex items-center px-2 py-1 boarder none" onClick={back}>
                        <ChevronLeftIcon className="w-6 h-6 mr-1" />
                    </button>
                </div>
                {students.length > 0 && (
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            {filteredStudents.map((item, index) => (
                                <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{index + 1}. {item.name} {item.last_name}{(item.special_case === 'invalid' || item.special_case === 'others') && '*'}</dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Bodovi: {item.totalPoints}</dd>
                                    <Link href={`/home/${courseId}/${item.id}`} passHref>
                                        <div className="mt-1 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg"
                                            style={{
                                                alignSelf: "center",
                                                width: "100px"
                                            }}>Detalji</div>
                                    </Link>
                                </div>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListStudentsPerCourse;

