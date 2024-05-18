import Layout from '../../../src/components/layout/Layout';
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

    }, [router.query.courseID]);

    return (
        <Layout>

            {/* Here we render tabs for smaller screen sizes (phones); */}


            {selectedPage === "listStudentsPerCourse" && idExists && <ListStudentsPerCourse courseId={courseID} />}

        </Layout>
    );
};

export default ListStudentsCourses;
