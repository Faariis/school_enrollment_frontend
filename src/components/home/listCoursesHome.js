import { useEffect, useState } from "react";
import Url from "../../../constants";
import Link from "next/link";

const ListCoursesHome = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getAllCourses() {
        try {
            let allCourses = [];
            let nextPage = `${Url}api/sec-schools/school-list/1/courses/`;
            while (nextPage) {
                const resp = await fetch(nextPage);
                const coursesData = await resp.json();
                allCourses = allCourses.concat(coursesData.results);
                nextPage = coursesData.next;
            }
            setCourses(allCourses);
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
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3 ml-3">Lista smjerova</h1>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {courses.map((item, index) => (
                            <div key={index} className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">
                                    {index + 1}.{' '}
                                    <Link href={`/home/${item._course_code}`}>
                                        <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{item.course_name}</span>
                                    </Link>
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Kod: {item._course_code}</dd>
                                <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">Trajanje: {item.course_duration}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ListCoursesHome;
