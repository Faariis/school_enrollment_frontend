import Layout from '../../src/components/layout/Layout';
import ListStudents from '../../src/components/user/listStudents'
import { useEffect, useState } from 'react';
import Sidebar from '../../src/components/user/sidebar';
import NewStudents from '../../src/components/user/newStudent';

const User = (props) => {
  const [selectedPage, setSelectedPage] = useState("listStudents")

  useEffect(() => {
    const a = 2
    const b = 3
    const c = 4
    if (a === 2 && (b === 2 || c === 4)) {
      console.log('true')
    } else {
      console.log('false')

    }
  })
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
          {selectedPage === "listStudents" && <ListStudents />}
          {selectedPage === "newStudent" && <NewStudents setSelectedPage={setSelectedPage} />}
        </div>
      </div>
    </Layout>
  )
};

export default User;
