import { useEffect, useState } from "react";
import Url from "../../../constants";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import useIsMobile from "./useIsMobile";
import useIsTablet from "./useIsTablet";
import useIsMiniTablet from "./useIsMiniTablet";

const ListStudentsPerCourse = ({ courseId }) => {
  const router = useRouter();
  const [allStudents, setStudents] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [noPerPage, setNoPerPage] = useState(10);
  const [totalRecords, setTotalRecord] = useState(0);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isMiniTablet = useIsMiniTablet();

  async function getStudents(courseId, pageNo) {
    try {
      const studentsData = await getAllStudents(courseId, pageNo, noPerPage);
      console.log("🚀 ~ getStudents ~ studentsData:", studentsData);
      setStudents(studentsData.extractedStudents);
      setTotalRecord(studentsData.totalPupils);
    } catch (e) {
      console.error("Error fetching student data:", e);
    }
  }

  useEffect(() => {
    getStudents(courseId, pageNo);
  }, [courseId, pageNo]);

  const back = () => {
    router.push("/");
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handlePageClick = (page) => {
    setPageNo(page);
  };

  const totalPages = Math.ceil(totalRecords / noPerPage);

  const filteredStudents = allStudents.filter((student) => {
    const fullName = `${student.last_name} ${student.name}`.toLowerCase();
    const reversedFullName = `${student.name} ${student.last_name}`.toLowerCase();
    const searchQuery = searchInput.toLowerCase();

    if (fullName.includes(searchQuery) || reversedFullName.includes(searchQuery)) {
      return true;
    }

    const lastNameMatch = student.last_name.toLowerCase().includes(searchQuery);
    const firstNameMatch = student.name.toLowerCase().includes(searchQuery);
    return lastNameMatch || firstNameMatch;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a.status !== "regular" && b.status === "regular") {
      return -1;
    } else if (a.status === "regular" && b.status !== "regular") {
      return 1;
    } else {
      return b.total_points - a.total_points;
    }
  });

  const visiblePages = [pageNo - 1, pageNo, pageNo + 1].filter(
    (page) => page > 0 && page <= totalPages
  );

  return (
  <div>
    {isMobile ? (
      <div>
        <button
          className="mr-3 mb-2 flex items-center px-2 py-1 border-none"
          onClick={back}
        >
          <ChevronLeftIcon className="w-6 h-6 mr-1" />
        </button>
        <div className="flex items-center justify-between mb-5">
          <h1 className="ml-3 text-2xl font-semibold">
            Lista učenika {courseId}
          </h1>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Unesite ime i/ili prezime"
            className="ml-3 px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
            value={searchInput}
            onChange={handleSearchInputChange}
          />
          <Link href={`/home/${courseId}/table`} passHref>
            <div className="mr-2 text-sm text-black bg-gray-300 sm:col-span-1 px-2 py-1 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg table-btn">
              Tabelarni prikaz
            </div>
          </Link>
        </div>
      </div>
    ) : (
      <div className="flex flex-col">
        <button
          className="ml-3 mb-2 flex items-center px-2 py-1 border-none"
          onClick={back}
        >
          <ChevronLeftIcon className="w-6 h-6 mr-1" />
        </button>
        <div className="flex items-center justify-between">
          <h1 className="ml-3 text-2xl font-semibold">
            Lista učenika {courseId}
          </h1>
          <div className="flex items-center pb-2">
            <Link href={`/home/${courseId}/table`} passHref>
              <div className="mr-2 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg table-btn">
                Tabelarni prikaz
              </div>
            </Link>
            <input
              type="text"
              placeholder="Unesite ime i/ili prezime"
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
              value={searchInput}
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
      </div>
    )}
    {sortedStudents.length > 0 ? (
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {!isMobile && !isTablet && !isMiniTablet && (
            <div className="mb-3 mt-3 flex">
              <dt className="text-gray-700 ml-5 font-bold min-w-[28rem]">Ime i prezime</dt>
              <dt className="text-gray-700 font-bold min-w-[12rem]">Bodovi</dt>
            </div>
          )}
          {isTablet && !isMobile && (
            <div className="mb-3 mt-3 flex">
              <dt className="text-gray-700 ml-5 font-bold min-w-[22rem]">Ime i prezime</dt>
              <dt className="text-gray-700 font-bold min-w-[10rem]">Bodovi</dt>
            </div>
          )}
          {isMiniTablet && !isMobile && !isTablet && (
            <div className="mb-3 mt-3 flex">
              <dt className="text-gray-700 ml-5 font-bold min-w-[17rem]">Ime i prezime</dt>
              <dt className="text-gray-700 font-bold min-w-[10rem]">Bodovi</dt>
            </div>
          )}
          {sortedStudents.map((item, index) => (
            <div
              key={index + (pageNo - 1) * noPerPage}
              className="py-4 sm:grid sm:grid-cols-3 sm:gap-44 sm:py-5 sm:px-6"
            >
              <div className="text-sm font-medium text-gray-500 first-letter:capitalize">
                <div>
                  {(index + 1) + (pageNo - 1) * noPerPage}. {item.last_name} {item.name}{item.status !== 'regular' && '*'}
                </div>
              </div>
              {isMobile && (
                <div className="mt-0.5 text-sm text-gray-900 flex justify-between items-center">
                  <div>
                    <dt className="min-w-[11rem]">Bodovi: {item.total_points}</dt>
                  </div>
                  <Link href={`/home/${courseId}/${item.id}`} passHref>
                    <div
                      className="text-sm text-black bg-gray-300 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg"
                      style={{ width: "100px", marginLeft: "10px" }}
                    >
                      Detalji
                    </div>
                  </Link>
                </div>
              )}
              {!isMobile && (
                <div className="mr-20 mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                  {item.total_points}
                </div>
              )}
              {!isMobile && (
                <Link href={`/home/${courseId}/${item.id}`} passHref>
                  <div className="mt-1 text-sm text-black bg-gray-300 sm:col-span-1 px-2 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center ml-auto shadow-lg">
                    Detalji
                  </div>
                </Link>
              )}
            </div>
          ))}
        </dl>
      </div>
    ) : (
      <p className="text-red-500 font-bold mt-3 ml-3">
        Trenutno niko nije upisan.
      </p>
    )}
    {/* Conditionally render pagination buttons if there are students */}
    {sortedStudents.length > 0 && (
      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageClick(pageNo - 1)}
          className="mr-10 text-sm text-white bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={pageNo === 1}
        >
          <FaArrowLeft />
        </button>
        {visiblePages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`text-sm mr-2 px-2 py-1 rounded-md ${
              page === pageNo ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-700'
            } hover:bg-gray-600 hover:text-white`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => handlePageClick(pageNo + 1)}
          className="ml-10 text-sm text-white bg-gray-500 px-4 py-2 hover:bg-gray-600 rounded-md shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={pageNo === totalPages}
        >
          <FaArrowRight />
        </button>
      </div>
    )}
  </div>
);
  };
  
  // Function to retrieve all students
  export const getAllStudents = async (courseId, pageNo = 1, noPerPage = 10) => {
    try {
      const resp = await fetch(
        `${Url}api/sec-students/student-list/1/${courseId}/${pageNo}/${noPerPage}/`,
        {
          method: "GET",
        }
      );
      const studentsData = await resp.json();
  
      const totalPupils = studentsData.total_pupils_on_this_course;
  
      console.log("studentsData:", studentsData);
  
      const extractedStudents = [];
  
      const studentEntries = Object.values(studentsData).filter((entry) =>
        Array.isArray(entry)
      );
  
      for (const studentEntry of studentEntries) {
        const student = {
          // [0];
          course_name: studentEntry[0]?.course_name || "",
          id: studentEntry[0]?.pupil_id || null,
          name: studentEntry[0]?.pupil_name || "",
          last_name: studentEntry[0]?.pupil_last_name || "",
          middle_name: studentEntry[0]?.pupil_middle_name || "",
          primary_school: studentEntry[0]?.pupil_primary_school || "",
          status: studentEntry[0]?.pupil_status || "",
          desired_course: studentEntry[0]?.pupil_desired_course || "",
          // [1];
          total_points: studentEntry[1]?.total_score || 0,
          // Statictics array [2][0];
          average_VI: studentEntry[2]?.statistics[0]?.average_VI || 0,
          average_VII: studentEntry[2]?.statistics[0]?.average_VII || 0,
          average_VIII: studentEntry[2]?.statistics[0]?.average_VIII || 0,
          average_IX: studentEntry[2]?.statistics[0]?.average_IX || 0,
          points: studentEntry[2]?.statistics[0]?.points || 0,
          // Total special points [2][1];
          total_special_points:
            studentEntry[2]?.statistics[1]?.total_special_points || 0,
          // Acknowledgments [2][2];
          total_federal_points:
            studentEntry[2]?.statistics[2]?.acknowledgments
              ?.total_federal_points || 0,
          total_canton_points:
            studentEntry[2]?.statistics[2]?.acknowledgments
              ?.total_canton_points || 0,
          total_district_points:
            studentEntry[2]?.statistics[2]?.acknowledgments
              ?.total_district_points || 0,
          total_ack_points:
            studentEntry[2]?.statistics[2]?.acknowledgments?.total_ack_points ||
            0,
          // Special courses grades [2][1];
          sc_per_grade: studentEntry[2]?.statistics[1]?.sc_per_grade || null,
        };
  
        // Extracting special courses grade data;
        const scPerGrade = studentEntry[2]?.statistics[1]?.sc_per_grade || [];
        const formattedScPerGrade = scPerGrade.map((grade) => ({
          class_code: grade.class_code || "",
          course_code: grade.course_code || "",
          score: grade.score || 0,
        }));
  
        student.sc_per_grade = formattedScPerGrade;
  
        extractedStudents.push(student);
      }
      return { extractedStudents, totalPupils };
    } catch (e) {
      console.error("Error fetching student data:", e);
      return [];
    }
  };
  
  export default ListStudentsPerCourse;