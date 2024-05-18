import Layout from '../../../src/components/layout/Layout'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TableDetails from '../../../src/components/home/tableDetails';

const ListStudentsDetail = (props) => {
    const [selectedPage, setSelectedPage] = useState("tableDetails");
    const router = useRouter();
    const { courseID } = router.query;
    const courseExists = courseID !== undefined && courseID !== null;


    return (
        <Layout>
            <div className="">
                {selectedPage === "tableDetails" && courseExists && <TableDetails courseId={courseID} />}
            </div>
        </Layout>
    );
};

export default ListStudentsDetail;