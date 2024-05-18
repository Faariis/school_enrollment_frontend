import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import Layout from '../src/components/layout/Layout';
import ListStudents from "../src/components/home/listStudentsHome";
import ListCoursesHome from "../src/components/home/listCoursesHome";
import SidebarHome from "../src/components/home/sidebarHome";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useContext } from "react";
import { Bars3Icon } from '@heroicons/react/24/outline';

const Home = (props) => {
  const [selectedPage, setSelectedPage] = useState("listCoursesHome");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const a = 2;
    const b = 3;
    const c = 4;
    if (a === 2 && (b === 2 || c === 4)) {
      console.log('true');
    } else {
      console.log('false');
    }
  });

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handlePageSelect = (page) => {
    setSelectedPage(page);
    setDropdownOpen(false);
  };

  return (
    <Layout>
      <div className="">
        {/* Here we render tabs for smaller screen sizes (phones); */}
        <div className="sm:hidden flex justify-start items-center gap-5 mb-8 relative">
          <button onClick={toggleDropdown} className="text-gray-700 text-2xl">
            <Bars3Icon className="ml-5 h-8 w-8" />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full mt-2 bg-white border rounded shadow-lg z-10">
              <button
                className={`block w-full px-6 py-2 text-left ${selectedPage === "listCoursesHome" ? "bg-gray-600 text-white" : "text-gray-700"
                  }`}
                onClick={() => handlePageSelect("listCoursesHome")}
              >
                Lista smjerova
              </button>
              <button
                className={`block w-full px-6 py-2 text-left ${selectedPage === "listStudentsHome" ? "bg-gray-600 text-white" : "text-gray-700"
                  }`}
                onClick={() => handlePageSelect("listStudentsHome")}
              >
                Prikaz učenika
              </button>
            </div>
          )}
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
            {selectedPage === "listStudentsHome" && <ListStudents setSelectedPage={setSelectedPage} />}
            {selectedPage === "listCoursesHome" && <ListCoursesHome />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
