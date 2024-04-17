import Layout from '../../../src/components/layout/Layout'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StudentDetails from '../../../src/components/home/studentDetails';

const ListStudentsDetail = (props) => {
    const [selectedPage, setSelectedPage] = useState("studentDetails");
    const router = useRouter();
    const { studentID } = router.query;
    const idExists = studentID !== undefined && studentID !== null;

    useEffect(() => {
        if (!router.query.studentID) {
            router.push('/user');
        }
    }, [router.query.studentID]);

    return (
        <Layout>
            <div className="">
                {selectedPage === "studentDetails" && idExists && <StudentDetails studentId={studentID} />}
            </div>
        </Layout>
    );
};

export default ListStudentsDetail;