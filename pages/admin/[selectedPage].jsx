import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../src/components/layout/Layout';
import Sidebar from '../../src/components/admin/sidebar';
import ListTeachers from '../../src/components/admin/listTeachers';
import NewTeacher from '../../src/components/admin/newTeacher';
import ListCourses from '../../src/components/admin/listCourses';
import NewStudents from '../../src/components/user/newStudent';
import ListStudents from '../../src/components/user/listStudents';

const Admin = () => {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState("listTeachers");

  useEffect(() => {
    if (router.query.selectedPage) {
      setSelectedPage(router.query.selectedPage);
    }
  }, [router.query.selectedPage]);

  return (
    <Layout>
      <div className="flex mt-6 gap-5">
        <div className="w-1/5 border-r">
          <Sidebar
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
          />
        </div>
        <div className="w-4/5">
          {selectedPage === "listTeachers" && <ListTeachers />}
          {selectedPage === "newTeacher" && <NewTeacher setSelectedPage={setSelectedPage} />}
          {selectedPage === "listStudents" && <ListStudents setSelectedPage={setSelectedPage} />}
          {selectedPage === "newStudent" && <NewStudents setSelectedPage={setSelectedPage} />}
          {selectedPage === "listCourses" && <ListCourses setSelectedPage={setSelectedPage} />}
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
