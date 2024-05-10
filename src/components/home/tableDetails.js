import React, { useEffect, useState } from "react";
import { getAllStudents } from "./listStudentsPerCourse";
import { allStudents } from "./listStudentsPerCourse";
import { useRouter } from "next/router";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "../PDFcomponent/PDFdocument";
import { useSession } from "next-auth/react";

const TableDetails = ({ courseId }) => {
  const { data: session } = useSession();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [noPerPage, setNoPerPage] = useState(10);
  const [totalRecords, setTotalRecord] = useState(0);
  const router = useRouter();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      let studentsData;
      if (allStudents && allStudents.length > 0) {
        // When we go to the page first time it loads the allStudents object;
        studentsData = allStudents.map((filteredStudent) => {
          const formattedSpecialScores = {};
          filteredStudent.sc_per_grade.forEach((grade) => {
            const key = `${grade.class_code} ${grade.course_code}`;
            formattedSpecialScores[key] = grade.score;
          });

          return {
            ...filteredStudent,
            acknowledgmentPoints: {
              F: filteredStudent.total_federal_points,
              K: filteredStudent.total_canton_points,
              O: filteredStudent.total_district_points,
            },
            total: filteredStudent.total_points,
            sv: filteredStudent.points,
            sv2: filteredStudent.total_special_points,
            sv3: filteredStudent.total_ack_points,
            averageScores: {
              VI: filteredStudent.average_VI,
              VII: filteredStudent.average_VII,
              VIII: filteredStudent.average_VIII,
              IX: filteredStudent.average_IX,
            },
            specialScores: formattedSpecialScores,
          };
        });
      } else {
        // If we referesh the page it loads this function (API call);
        const getStudentData = await getAllStudents(
          courseId,
          pageNo,
          noPerPage
        );
        studentsData = getStudentData.extractedStudents;
        setTotalRecord(getStudentData.totalPupils);
        setPageNo(pageNo + 1);
        if (studentsData && studentsData.length > 0) {
          studentsData = studentsData.map((student) => {
            const formattedSpecialScores = {};
            student.sc_per_grade.forEach((grade) => {
              const key = `${grade.class_code} ${grade.course_code}`;
              formattedSpecialScores[key] = grade.score;
            });

            return {
              ...student,
              acknowledgmentPoints: {
                F: student.total_federal_points,
                K: student.total_canton_points,
                O: student.total_district_points,
              },
              total: student.total_points,
              sv: student.points,
              sv2: student.total_special_points,
              sv3: student.total_ack_points,
              averageScores: {
                VI: student.average_VI,
                VII: student.average_VII,
                VIII: student.average_VIII,
                IX: student.average_IX,
              },
              specialScores: formattedSpecialScores,
            };
          });
        } else {
          console.error("No student data available.");
        }
      }
      // Sorting the students by points;
      studentsData.sort((a, b) => b.total - a.total);
      setStudents((prevStudents) => [...prevStudents, ...studentsData]);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [courseId]);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  const specialScoreNames = Object.keys(
    students[0]?.specialScores || {}
  ).filter((key) => {
    const classCode = key.split(" ")[0];
    return classCode === "VIII" || classCode === "IX";
  });

  const loadMoreStudents = async () => {
    fetchStudents();
  };

  return (
    <div className="full-w overflow-x-auto">
      <button
        onClick={() => router.push(`/home/${courseId}`)}
        className="flex items-center px-2 py-1 rounded-md hover:bg-gray-300 focus:outline-none"
      >
        <ChevronLeftIcon className="w-6 h-6 mr-10" />{" "}
        <div className="font-bold text-gray-800">Smjer: {courseId}</div>
      </button>
      {session && (
        <PDFDownloadLink
          className="mt-2 w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg mr-2 flex items-center justify-center"
          document={
            <PDFDocument
              students={students}
              specialScoreNames={specialScoreNames}
              courseId={courseId}
            />
          }
          fileName="tabela.pdf"
        >
          {({ blob, url, loading, error }) =>
            loading ? "Učitavanje..." : "Preuzmi PDF"
          }
        </PDFDownloadLink>
      )}
      <table className="min-w-full border border-gray-200 mt-2">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            <th
              colSpan="3"
              scope="colgroup"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
            >
              Generalije
            </th>
            {students[0]?.averageScores &&
              Object.keys(students[0]?.averageScores).length > 0 && (
                <>
                  <th
                    colSpan={Object.keys(students[0]?.averageScores).length + 1}
                    scope="colgroup"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                  >
                    I-Opšti kriterij - Uzima se USPJEH od VI do IX razreda O.Š.
                    zatim se sabere i pomnoži sa 3. (max: 60)
                  </th>
                  <th
                    colSpan="7"
                    scope="colgroup"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                  >
                    II-Posebni kriterij - Uzimaju se relevantni nastavni
                    predmeti iz završnih razreda VIII i IX i saberu. (max: 30)
                  </th>
                  <th
                    colSpan="4"
                    scope="colgroup"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                  >
                    III-Specijalni kriterij - Uzimaju se bodovi iz takmičenja za
                    VIII i IX razred i saberu. (ovo su dodatni bodovi)
                  </th>
                  <th
                    colSpan="1"
                    scope="colgroup"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                  ></th>
                </>
              )}
          </tr>
          <tr>
            {[
              "RB",
              "Ime i prezime",
              "Osnovna škola",
              ...(students[0]?.averageScores
                ? Object.keys(students[0]?.averageScores)
                : []),
              "SV (Opšti kriterij)",
              ...specialScoreNames,
              "SV (posebni kriterij)",
              "Federalno",
              "Kantonalno",
              "Općinsko",
              "SV (specijalni kriterij)",
              "Ukupno",
            ].map((header) => (
              <th
                key={header}
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student, studentIndex) => (
            <tr key={studentIndex}>
              <td className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200">
                {studentIndex + 1}
              </td>
              {[
                `${student?.name} ${student?.last_name}`,
                student?.primary_school,
                ...Object.values(student?.averageScores || {}),
                student?.sv,
                ...Object.values(student?.specialScores || {}).filter(
                  (score, index) => {
                    const classCode = Object.keys(student?.specialScores || {})[
                      index
                    ]?.split(" ")[0];
                    return classCode === "VIII" || classCode === "IX";
                  }
                ),
                student?.sv2,
                ...Object.values(student?.acknowledgmentPoints || {}),
                student?.sv3,
                student?.total,
              ].map((value, index) => (
                <td
                  key={index}
                  className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200"
                >
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {totalRecords > students.length ? (
        <div
          onClick={() => loadMoreStudents()}
          className="flex justify-center items-center h-10 rounded w-60 cursor-pointer border mt-20 bg-gray-800 text-white"
        >
          <span>Učitaj još učenika</span>
        </div>
      ) : (
        <div className="flex justify-center items-center h-10 rounded w-60 cursor-pointer border mt-20 bg-gray-800 text-white">
          <span>Svi učenici su učitani</span>
        </div>
      )}
    </div>
  );
};

export default TableDetails;
