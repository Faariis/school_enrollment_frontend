import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";
import ConfirmationModal from "../delete/confirmationModal";
import Link from "next/link";

const ListStudents = () => {
    const { status, data } = useSession();
    const [students, setStudents] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    async function getStudents(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/sec-students/student-list`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            })
            const studentsData = await resp.json();
            setStudents(studentsData)
        } catch (e) {
            console.log(e)
        }
    }

    // Function for deleting students;
    async function deleteStudent(id) {
    try {
      const resp = await fetch(`${Url}/api/sec-students/student-list/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${data.user.token}`,
        },
      });
      if (resp.ok) {
        setStudents(students.filter((student) => student.id !== id));
      } else {
        console.error("Failed to delete student!");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  }

    useEffect(() => {
        if (data) {
            getStudents(data)
        }
    }, [data])

    // It lists the students based on the teachers course;
  /*const filteredStudents = students.filter(
    (i) => i.desired_course_A == data.user.course_code
  );*/

  const filteredStudents = Array.isArray(students)
  ? students.filter(i => i.desired_course_A === data.user.course_code)
  : [];

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-3">Lista učenika</h1>
        {students.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {filteredStudents.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="py-4 sm:grid sm:grid-cols-6 sm:gap-4 sm:py-5 sm:px-6"
                  >
                    <dt className="text-sm font-medium text-gray-500 first-letter:capitalize">
                      {index + 1}. {item.name} {item.last_name}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                      Mail: {item.email}
                    </dd>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                      Smjer: {item.desired_course_A}
                    </dd>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-1 sm:mt-0">
                      Telefon: {item.guardian_number}
                    </dd>
                    {/* Instead of a button we are using a link */}
                    <Link href={`/user/pupils/${item.id}/edit`} passHref>
                      <div
                        className="mt-1 text-sm text-black bg-gray-300 sm:col-span-1 px-4 py-2 hover:bg-gray-400 rounded-md flex items-center justify-center shadow-lg ml-2"
                        style={{
                          alignSelf: "center",
                          width: "100px",
                          marginLeft: "60px",
                        }}
                      >
                        Uredi
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        setStudentToDelete(item);
                        setShowDeleteModal(true);
                      }}
                      className="mt-1 text-sm text-white bg-red-500 sm:col-span-1 px-4 py-2 hover:bg-red-600 rounded-md shadow-lg ml-4"
                      style={{ alignSelf: "center", width: "100px" }}
                    >
                      Izbriši
                    </button>
                  </div>
                );
              })}
            </dl>
          </div>
        )}
      </div>
      {/* Render the delete modal */}
      {showDeleteModal && (
        <ConfirmationModal
          message="Da li ste sigurni da želite izbrisati ovog učenika?"
          onConfirm={() => {
            deleteStudent(studentToDelete.id);
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
};

export default ListStudents;