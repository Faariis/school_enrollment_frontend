import React from 'react';
import GradeForm from '../form/gradesForm';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import Url from '../../../constants';

const AddGradesNinth = ({ studentId, setSelectedPage }) => {
  const { data } = useSession();

      const handleSubmit = async (dataVal) => {
        try {
          const grade9Subjects = ['BOS', 'ENG', 'GER', 'HIS', 'GEO', 'LIK', 'MUZ', 'MM', 
          'FIZ', 'HEM', 'BIO', 'TZO', 'TEH', 'INF', 'GRAD', 'VJE'];
      
          const courses = grade9Subjects.map((subject) => ({
            score: dataVal[subject],
            class_id: 'IX',
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

  const grade9Subjects = ['Bosanski jezik i književnost', 'Engleski jezik', 'Njemački jezik', 'Historija/Povijest/Istorija',
  'Geografija/Zemljopis', 'Likovna kultura', 'Muzička/Glazbena kultura', 'Matematika', 'Fizika', 'Hemija/Kemija', 'Biologija', 'Tjelesni i zdravstveni odgoj',
  'Tehnička kultura', 'Informatika', 'Građansko obrazovanje', 'Islamska vjeronauka'];

  return <GradeForm onSubmit={handleSubmit} classId="IX" subjects={grade9Subjects} />;
};

export default AddGradesNinth;