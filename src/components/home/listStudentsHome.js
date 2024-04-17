import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";

const ListStudents = () => {
    const { data } = useSession();
    const [students, setStudents] = useState([]);
    const [nameInput, setNameInput] = useState('');
    
    async function getStudents(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list`, {
                method: 'GET',
                headers: {
                    'Authorization': dataInfo ? `Bearer ${dataInfo.user.token}` : null
                }
            });
            const studentsData = await resp.json();

            // Fetch total points for each student (no course needed);
            const studentsWithPoints = await Promise.all(studentsData.map(async (student) => {
                const pointsSummary = await getTotalPoints(student.id);
                return { ...student, pointsSummary };
            }));
            
            setStudents(studentsWithPoints);
        } catch (e) {
            console.log(e);
        }
    }

    async function getTotalPoints(studentId) {
        try {
            const resp = await fetch(`${Url}/api/sec-students/student/${studentId}/points-summary/`, {
                method: 'GET',
                headers: {
                    'Authorization': data ? `Bearer ${data.user.token}` : null
                }
            });
            const summaryPointsData = await resp.json();

            // Extract course code and total points for each course;
            const pointsSummary = summaryPointsData.map(item => ({
                course: item.course.toUpperCase(),
                totalPoints: item.total_points
            }));

            return pointsSummary;
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    useEffect(() => {
        getStudents(data);
    }, []);

    const handleInputChange = (event) => {
        setNameInput(event.target.value);
    };
    
    // Filter students dynamically based on name input;
    const filteredStudents = nameInput.trim() === '' ? [] : students.filter(student => {
        const fullName = `${student.name} ${student.last_name}`.toLowerCase();
        const lowerCaseNameInput = nameInput.trim().toLowerCase();
        return fullName.includes(lowerCaseNameInput);
    });

    return (
        <div>
            <div className="flex justify-center" style={{ paddingBottom: '40px' }}>
                <h1 className="text-4xl font-semibold text-center">Dobrodošli</h1>
            </div>
            <div className="flex flex-col">
                <div className="mb-4">
                    <label htmlFor="courseInput" className="block text-sm font-bold mb-2 ml-3">Unesite ime i prezime učenika:</label>
                    <input
                        id="nameInput"
                        type="text"
                        className="border rounded w-full py-2 px-3"
                        value={nameInput}
                        onChange={handleInputChange}
                        placeholder="Unesi ime i prezime"
                    />
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        {filteredStudents.map((student, index) => (
                            <div key={index}>
                                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">{student.name} {student.last_name}</dt>
                                    {student.pointsSummary.map((item, index) => (
                                        <div key={index} className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                                            Bodovi ({item.course}): {item.totalPoints}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default ListStudents;

