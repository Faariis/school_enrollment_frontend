import { useRouter } from 'next/router';
import EditTeacher from '../../../src/components/admin/editTeacher';
import { useEffect, useState } from 'react';

const EditTeacherPage = () => {
    const router = useRouter();
    const { id } = router.query;

    const idExists = id !== undefined && id !== null;

    useEffect(() => {
        // If we manually type the id it returns us to the admin page;
        if (!router.query.id) {
            router.push('/admin');
        }
    }, [router.query.id]);

    return (
        <div>
            {idExists && <EditTeacher teacherId={id} />}
        </div>
    );
};

export default EditTeacherPage;