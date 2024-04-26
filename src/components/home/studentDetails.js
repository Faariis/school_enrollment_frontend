import React, { useEffect, useState } from "react";
import { getAllStudents } from "./listStudentsPerCourse";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Url from "../../../constants";

const StudentDetails = ({ courseId, studentId }) => {
  const [student, setStudent] = useState(null);
  const [averageScores, setAverageScores] = useState(null);
  const [acknowledgmentPoints, setAcknowledgmentPoints] = useState(null);
  const [total, setTotal] = useState(null);
  const [sv, setSV] = useState(null);
  const [sv2, setSV2] = useState(null);
  const [sv3, setSV3] = useState(null);
  const [specialScores, setSpecialScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataTable, setDataTable] = useState(true);
  const router = useRouter();

  // Utility functions
 const processData = (student) => {
    const {
      name,
      last_name,
      primary_school,
      points,
      total_special_points,
      total_federal_points,
      total_canton_points,
      total_district_points,
      total_ack_points,
      total_points,
      sc_per_grade,
      average_VI,
      average_VII,
      average_VIII,
      average_IX,
    } = student;
  
    const fullName = `${name} ${last_name}`;
    const averages = [average_VI, average_VII, average_VIII, average_IX];
    const scores = sc_per_grade.filter((grade) => ['VIII', 'IX'].includes(grade.class_code))
      .map((grade) => grade.score);
    
    return [
      fullName,
      primary_school,
      ...averages,
      points,
      ...scores,
      total_special_points,
      total_federal_points,
      total_canton_points,
      total_district_points,
      total_ack_points,
      total_points,
    ];
  };
  
  // Fetching and handling data
  const fetchStudents = async () => {
    try {
      const studentsData = await getAllStudents(courseId);
      if (!studentsData || studentsData.length === 0) {
        throw new Error("No student data available.");
      }
  
      const filteredStudent = studentsData.find(
        (student) => student.id === parseInt(studentId)
      );
      if (!filteredStudent) {
        throw new Error(`Student with ID ${studentId} not found.`);
      }
      setStudentDetails(filteredStudent);
      const displayData = processData(filteredStudent);
      setDataTable(displayData);
    } catch (error) {
      console.error("Error fetching students:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const setStudentDetails = (student) => {
    setStudent(student);
    setAcknowledgmentPoints({
      F: student.total_federal_points,
      K: student.total_canton_points,
      O: student.total_district_points,
    });
    setTotal(student.total_points);
    setSV(student.points);
    setSV2(student.total_special_points);
    setSV3(student.total_ack_points);
    setAverageScores({
      VI: student.average_VI,
      VII: student.average_VII,
      VIII: student.average_VIII,
      IX: student.average_IX,
    });
    const specialScores = {};
    student.sc_per_grade.forEach((grade) => {
      const key = `${grade.class_code} ${grade.course_code}`;
      specialScores[key] = grade.score;
    });
    setSpecialScores(specialScores);
  };

  useEffect(() => {
    const storedItem = localStorage.getItem("lastSelectedItem");
    if (storedItem) {
      const studentObject = JSON.parse(storedItem);
      setStudentDetails(studentObject);
      const resultArray = processData(studentObject);
      setDataTable(resultArray);
      setLoading(false)
    } else {
      fetchStudents();
    }
  }, [courseId, studentId]);

  if (loading) {
    return <div>Učitavanje...</div>;
  }

  const specialScoreNames = Object.keys(specialScores || {}).filter((key) => {
    const classCode = key.split(" ")[0];
    return classCode === "VIII" || classCode === "IX";
  });

  return (
    <div className="full-w overflow-x-auto">
      <button
        onClick={() => router.push(`/home/${courseId}`)}
        className="flex items-center px-2 py-1 rounded-md hover:bg-gray-300 focus:outline-none"
      >
        <ChevronLeftIcon className="w-6 h-6 mr-1" />
      </button>
      <table className="min-w-full border border-gray-200 mt-2">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            <th
              colSpan="2"
              scope="colgroup"
              className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
            >
              Generalije
            </th>
            {averageScores && Object.keys(averageScores).length > 0 && (
              <>
                <th
                  colSpan={Object.keys(averageScores).length + 1}
                  scope="colgroup"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                >
                  I-Opšti kriterij - USPJEH VI - IX O.Š. x3
                </th>
                <th
                  colSpan="7"
                  scope="colgroup"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                >
                  II-Posebni kriterij - RELEVANTNI NASTAVNI PREDMETI
                </th>
                <th
                  colSpan="4"
                  scope="colgroup"
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200"
                >
                  III-Specijalni kriterij - TAKMIČENJE VIII i IX RAZRED
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
              "Ime i prezime",
              "Osnovna škola",
              ...Object.keys(averageScores || {}),
              "SV (Opšti kriterij)",
              ...specialScoreNames,
              "SV (posebni kriterij)",
              "O",
              "K",
              "F",
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
          <tr>
            {dataTable &&
              dataTable.length > 0 &&
              dataTable?.map((value, index) => {
                return (
                  <td
                    key={index}
                    className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200"
                  >
                    {value}
                  </td>
                );
              })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default StudentDetails;
