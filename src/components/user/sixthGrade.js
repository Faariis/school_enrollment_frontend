import React from 'react';
import GradeForm from '../form/gradesForm';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import Url from '../../../constants';

const AddGradesSixth = ({ studentId, setSelectedPage }) => {
  const { data } = useSession();

      const handleSubmit = async (dataVal) => {
        try {
          const grade6Subjects = ['BOS', 'ENGG', 'GER', 'HIS', 'GEO', 'LIK', 'MUZ', 'MMM', 
          'BIOO', 'TZO', 'TEH', 'INF', 'VJE'];

          const courses = grade6Subjects.map((subject) => ({
            score: dataVal[subject],
            class_id: 'VI',
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

          setSelectedPage('sixthGrade');
        } catch (e) {
          console.log(e);
        }
      };

  const grade6Subjects = ['Bosanski jezik i književnost', 'Engleski jezik', 'Njemački jezik', 'Historija/Povijest/Istorija',
  'Geografija/Zemljopis', 'Likovna kultura', 'Muzička/Glazbena kultura', 'Matematika', 'Biologija', 'Tjelesni i zdravstveni odgoj',
  'Tehnička kultura', 'Informatika', 'Islamska vjeronauka'];

  return <GradeForm onSubmit={handleSubmit} classId="VI" subjects={grade6Subjects} />;
};

export default AddGradesSixth;