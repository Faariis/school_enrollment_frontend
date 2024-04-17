import Layout from '../../../src/components/layout/Layout'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SidebarHomeStudents from '../../../src/components/home/sidebarHomeStudents';
import ListStudentsPerCourse from '../../../src/components/home/listStudentsPerCourse';

const ListStudentsCourses = (props) => {
    const [selectedPage, setSelectedPage] = useState("listStudentsPerCourse");
    const router = useRouter();
    const { courseID } = router.query;
    const idExists = courseID !== undefined && courseID !== null;

    useEffect(() => {
        if (!router.query.courseID) {
            router.push('/user');
        }
    }, [router.query.courseID]);

    return (
        <Layout>
            <div className="flex mt-6 gap-5">
                <div className="w-1/5 border-r">
                    <SidebarHomeStudents
                        selectedPage={selectedPage}
                        setSelectedPage={setSelectedPage}
                    />
                </div>
                <div className="flex-grow">
                    {selectedPage === "listStudentsPerCourse" && idExists && <ListStudentsPerCourse courseId={courseID} />}
                </div>
            </div>
        </Layout>
    );
};

export default ListStudentsCourses;