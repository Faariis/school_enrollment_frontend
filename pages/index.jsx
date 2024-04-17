import { useRouter } from "next/router";

import { toast } from 'react-toastify';
import Layout from '../src/components/layout/Layout';
import ListStudents from "../src/components/home/listStudentsHome";
import ListCoursesHome from "../src/components/home/listCoursesHome";
import SidebarHome from "../src/components/home/sidebarHome";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useContext } from "react";

const Home = (props) => {
  const [selectedPage, setSelectedPage] = useState("listStudentsHome")

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
      <div className="">
        {/* Here we render tabs for smaller screen sizes (phones); */}
        <div className="sm:hidden flex justify-center gap-5 mb-8">
          <button
            className={`px-6 py-2 rounded-lg text-white font-semibold ${selectedPage === "listStudentsHome" ? "bg-gray-600" : "bg-gray-500"
              }`}
            onClick={() => setSelectedPage("listStudentsHome")}
          >
            Lista učenika
          </button>
          <button
            className={`px-6 py-2 rounded-lg text-white font-semibold ${selectedPage === "listCoursesHome" ? "bg-gray-600" : "bg-gray-500"
              }`}
            onClick={() => setSelectedPage("listCoursesHome")}
          >Lista smjerova</button>
        </div>

        {/* This is displayed for normal sized screens (computers, laptops) */}
        <div className="sm:flex gap-5">
          <div className="sm:w-1/5 hidden sm:block border-r">
            <SidebarHome
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
          </div>
          <div className="sm:w-4/5">
            {selectedPage === "listStudentsHome" && <ListStudents />}
            {selectedPage === "listCoursesHome" && <ListCoursesHome setSelectedPage={setSelectedPage} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;

