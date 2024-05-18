import React from 'react';
import GradeForm from '../form/gradesForm';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import Url from '../../../constants';

const AddGradesEight = ({ studentId, setSelectedPage }) => {
  const { data } = useSession();

      const handleSubmit = async (dataVal) => {
        try {
          const grade8Subjects = ["MM", "BIO", "ENG"];

          const courses = grade8Subjects.map((subject) => ({
            score: dataVal[subject],
            class_id: 'VIII',
            course_code: subject,
            pupil_id: studentId,
          }));

          for (const courseData of courses) {
            await fetch(`${Url}/api/sec-students/student-list/${studentId}/course-create/`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${data.user.token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(courseData),
            });
          }
      
          setSelectedPage('eightGrade');
        } catch (e) {
          console.log(e);
        }
      };

  const grade8Subjects = ['Matematika', 'Biologija', 'Engleski'];

  return <GradeForm onSubmit={handleSubmit} classId="VIII" subjects={grade8Subjects} />;
};

export default AddGradesEight;