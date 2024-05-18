import { useEffect, useState } from "react";
import Url from "../../../constants";
import Link from "next/link";
import { useSession } from "next-auth/react";
import useIsMobile from "./useIsMobile";
import useIsTablet from "./useIsTablet";
import useIsMiniTablet from "./useIsMiniTablet";

const ListCoursesHome = () => {
    const { data } = useSession();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const isMiniTablet = useIsMiniTablet();

    async function getAllCourses() {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list/1/all-courses/`, {});
            const coursesData = await resp.json();
            setCourses(coursesData.courses_names.map((courseName, index) => ({
                course_name: courseName,
                _course_code: coursesData.courses_codes[index],
                course_duration: coursesData.duration[index],
                num_of_students: coursesData.num_of_students[index]
            })));
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getAllCourses();
    }, []);

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div>
            <div className="flex justify-center" style={{ paddingBottom: '40px' }}>
                <h1 className="text-3xl font-semibold text-center ml-2 mr-2">Dobrodošli na upis učenika u Tehničku školu 2024/2025</h1>
            </div>
            <div className="flex flex-col">
                {isMobile && (
                    <h1 className="text-2xl font-semibold mb-3 ml-3">Lista smjerova</h1>
                )}
                {!loading && !isMobile && !isTablet && !isMiniTablet && (
                    <div className="flex mb-3">
                        <dt className="text-gray-700 ml-5 font-bold min-w-[23rem]">Smjerovi</dt>
                        <dt className="text-gray-700 ml-5 font-bold min-w-[14rem]">Trajanje</dt>
                        <dt className="text-gray-700 ml-5 font-bold">Trenutno upisanih</dt>
                    </div>
                )}
                {isTablet && !isMobile && (
                    <div className="flex mb-3">
                        <dt className="text-gray-700 ml-5 font-bold min-w-[19rem]">Smjerovi</dt>
                        <dt className="text-gray-700 ml-5 font-bold min-w-[10rem]">Trajanje</dt>
                        <dt className="text-gray-700 ml-5 font-bold">Trenutno upisanih</dt>
                    </div>
                )}
                {isMiniTablet && !isTablet && (
                    <div className="flex mb-3">
                        <dt className="text-gray-700 text-xs ml-5 font-bold min-w-[15rem]">Smjerovi</dt>
                        <dt className="text-gray-700 text-xs ml-5 font-bold min-w-[7rem]">Trajanje</dt>
                        <dt className="text-gray-700 text-xs ml-5 font-bold">Trenutno upisanih</dt>
                    </div>
                )}
                {isMobile && (
                    <div className="flex"></div>
                )}
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {courses.map((item, index) => (
                            <div key={index} className="py-4">
                                <div className={isMobile ? "flex flex-col" : "sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6"}>
                                    {item && item._course_code && (
                                        <div className={isMobile ? "mb-2" : "sm:col-span-1"}>
                                            <Link href={`/home/${item._course_code.toUpperCase()}`}>
                                                <span className="underline cursor-pointer text-gray-700">{item.course_name}</span>
                                            </Link>
                                        </div>
                                    )}
                                    {item && item._course_code && isMobile && (
                                        <div className="text-sm text-gray-900">Trajanje: {item.course_duration} godine</div>
                                    )}
                                    {item && item._course_code && !isMobile && (
                                        <div className="mt-1 text-md text-gray-900 ml-20">{item.course_duration} godine</div>
                                    )}
                                    {item && item._course_code && isMobile && (
                                        <div className="text-sm text-gray-900">Trenutno upisanih: {item.num_of_students}</div>
                                    )}
                                    {item && item._course_code && !isMobile && (
                                        <div className="mt-1 text-md text-gray-900 ml-20">{item.num_of_students}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
    }

export default ListCoursesHome;
