import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import Url from "../../../constants";

const StudentDetails = ({ studentId, courseId }) => {
    const [student, setStudent] = useState(null);
    const [averageScores, setAverageScores] = useState(null);
    const [acknowledgmentPoints, setAcknowledgmentPoints] = useState(null);
    const [total, setTotal] = useState(null);
    const [sv, setSV] = useState(null);
    const [sv2, setSV2] = useState(null);
    const [sv3, setSV3] = useState(null);
    const [specialScores, setSpecialScores] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    console.log(studentId);
    console.log(courseId);

    const fetchData = async () => {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list/1/${studentId}/${courseId}/`, {
                method: 'GET',
            });
            const responseData = await resp.json();
            console.log('Response:', responseData);
            if (responseData && responseData[0]) {
                const data = responseData[0];

                const studentData = data[0];
                const totalPoints = data[1]
                const statistics = data[2];

                const pupil = {
                    course_name: studentData?.course_name || "",
                    id: studentData?.pupil_id || null,
                    name: studentData?.pupil_name || "",
                    last_name: studentData?.pupil_last_name || "",
                    middle_name: studentData?.pupil_middle_name || "",
                    primary_school: studentData?.pupil_primary_school || "",
                    status: studentData?.pupil_status || "",
                    desired_course: studentData?.pupil_desired_course || "",
                    total_points: totalPoints?.total_score || 0,
                    average_VI: statistics?.statistics[0].average_VI || 0,
                    average_VII: statistics?.statistics[0].average_VII || 0,
                    average_VIII: statistics?.statistics[0].average_VIII || 0,
                    average_IX: statistics?.statistics[0].average_IX || 0,
                    points: statistics?.statistics[0].points || 0,
                    total_special_points: statistics?.statistics[1]?.total_special_points || 0,
                    total_federal_points: statistics?.statistics[2]?.acknowledgments?.total_federal_points || 0,
                    total_canton_points: statistics?.statistics[2]?.acknowledgments?.total_canton_points || 0,
                    total_district_points: statistics?.statistics[2]?.acknowledgments?.total_district_points || 0,
                    total_ack_points: statistics?.statistics[2]?.acknowledgments?.total_ack_points || 0,
                    sc_per_grade: (statistics?.statistics[1]?.sc_per_grade || []).map(grade => ({
                        class_code: grade?.class_code || "",
                        course_code: grade?.course_code || "",
                        score: grade?.score || 0
                    }))
                };

                // Update states
                setStudent(pupil);
                setAcknowledgmentPoints({
                    F: pupil.total_federal_points,
                    K: pupil.total_canton_points,
                    O: pupil.total_district_points
                });
                console.log("Priznanja", acknowledgmentPoints)
                setTotal(pupil.total_points);
                setSV(pupil.points);
                setSV2(pupil.total_special_points);
                setSV3(pupil.total_ack_points);
                setAverageScores({
                    VI: pupil.average_VI,
                    VII: pupil.average_VII,
                    VIII: pupil.average_VIII,
                    IX: pupil.average_IX
                });
                const formattedSpecialScores = {};
                pupil.sc_per_grade.forEach(grade => {
                    const key = `${grade.class_code} ${grade.course_code}`;
                    formattedSpecialScores[key] = grade.score;
                });
                setSpecialScores(formattedSpecialScores);
            } else {
                console.error('No student data available.');
            }
        } catch (error) {
            console.error('Error fetching student data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [courseId, studentId]);

    if (loading) {
        return <div>Učitavanje...</div>;
    }

    const specialScoreNames = Object.keys(specialScores || {})
        .filter(key => {
            const classCode = key.split(" ")[0];
            return classCode === "VIII" || classCode === "IX";
        });

        const defaultHeaders =
        !specialScoreNames.length === 0 && !specialScoreNames === 3
          ? specialScoreNames
          : specialScoreNames.length === 0
          ? ['IX-1', 'IX-2', 'IX-3', 'VIII-1', 'VIII-2', 'VIII-3']
          : specialScoreNames.length === 3
          ? [...specialScoreNames, 'IX/VIII-1', 'IX/VIII-2', 'IX/VIII-3']
          : specialScoreNames;
      
    return (
        <div className="full-w overflow-x-auto">
            <div className='flex'>
            <button onClick={() => router.push(`/home/${courseId}`)} className="flex items-center px-2 py-1 rounded-md hover:bg-gray-300 focus:outline-none">
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <div className="ml-2 mt-1 font-bold text-gray-800">Smjer: {courseId}</div>
            </div>
            <table className="min-w-full border border-gray-200 mt-2">
                <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                        <th colSpan="2" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">Generalije</th>
                        {averageScores && Object.keys(averageScores).length > 0 && (
                            <>
                                <th colSpan={Object.keys(averageScores).length + 1} scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">I-Opšti kriterij - Uzima se USPJEH od VI do IX razreda O.Š. zatim se sabere i pomnoži sa 3. (max: 60)</th>
                                <th colSpan="7" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">II-Posebni kriterij - Uzimaju se relevantni nastavni predmeti iz završnih razreda VIII i IX i saberu. (max: 30)</th>
                                <th colSpan="4" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">III-Specijalni kriterij - Uzimaju se bodovi iz takmičenja za VIII i IX razred i saberu. (ovo su dodatni bodovi)</th>
                                <th colSpan="1" scope="colgroup" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"></th>
                            </>
                        )}
                    </tr>
                    <tr>
                        {['Ime i prezime', 'Osnovna škola', ...Object.keys(averageScores || {}), 'SV-I (Opšti kriterij)', ...defaultHeaders, 'SV-II (posebni kriterij)', 'Federalno', 'Kantonalno', 'Općinsko', 'SV-III (specijalni kriterij)', 'Ukupno'].map(header => (
                            <th key={header} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                        {[`${student?.last_name} ${student?.name}`, student?.primary_school, ...(Object.values(averageScores || {})), sv, ...defaultHeaders.map(header => specialScores?.[header] || 0), sv2, ...(Object.values(acknowledgmentPoints || {})), sv3, total].map((value, index) => (
                                <td key={index} className="px-6 py-4 text-center whitespace-nowrap border-r border-gray-200">{value}</td>
                            ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default StudentDetails;
