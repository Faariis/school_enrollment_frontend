import React, { useState, useEffect } from 'react';
import GradeForm from '../form/gradesForm';
import { useSession } from 'next-auth/react';
import Url from '../../../constants';

const GradePage = ({ studentId, setSelectedPage, selectedTab }) => {
  const { data } = useSession();
  const [gradeSubjects, setGradeSubjects] = useState([]);
  const [classId, setClassId] = useState('');
  const [existingScores, setExistingScores] = useState([]);

  // Function to map the current tab to the next tab
  const getNextTab = (currentTab) => {
    const tabToGradeMap = {
      sixthGrade: 'seventhGrade',
      seventhGrade: 'eightGrade',
      eightGrade: 'ninthGrade',
      ninthGrade: null, // No next tab for ninth grade
    };
    return tabToGradeMap[currentTab];
  };

  const fetchData = async (grade, studentId) => {
    try {
      const response = await fetch(`${Url}api/sec-students/student-list/primary-school/class/${grade}/student/${studentId}/`, {
        headers: {
          Authorization: `Bearer ${data.user.token}`,
        },
      });
      // if the response status is 200;
      if (response.status === 200) {
        const responseData = await response.json();
        const tabToGradeMap = {
          sixthGrade: 'VI',
          seventhGrade: 'VII',
          eightGrade: 'VIII',
          ninthGrade: 'IX',
        };
        const currentGrade = tabToGradeMap[selectedTab];
        let classId = '';
  
        if (grade === '6') {
          classId = 'VI';
        } else if (grade === '7') {
          classId = 'VII';
        } else if (grade === '8') {
          classId = 'VIII';
        } else if (grade === '9') {
          classId = 'IX';
        }

          // When scores are available, we fetch the existing scores;
          const scores = responseData.data;
          const filteredScores = scores.filter(score => score.class_id === currentGrade);
          setExistingScores(filteredScores);
          const courseCodes = responseData.data.map(item => item.course_code);
          setClassId(classId);
          setGradeSubjects([...courseCodes]);
      // if the response status is 404;
      } else if (response.status === 404) {
        // If there are no socres entered we fetch the courses;
        const data = await response.json();
        const courseCodes = data.courses.data;
        setClassId(data.class_id);
        setGradeSubjects([...courseCodes]);
        setExistingScores([]);
      } else {
        console.error('Failed to fetch data!');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(selectedTab === 'sixthGrade' ? '6' : selectedTab === 'seventhGrade' ? '7' : selectedTab === 'eightGrade' ? '8' : '9', studentId);
  }, [selectedTab, studentId]);

  const handleSubmit = async (dataVal) => {
    const tabToGradeMap = {
      sixthGrade: '6',
      seventhGrade: '7',
      eightGrade: '8',
      ninthGrade: '9',
    };
    const grade = tabToGradeMap[selectedTab];

    try {
      const courses = [];
      gradeSubjects.forEach((subject) => {
        const score = dataVal[subject];

        if (subject !== 'VJR' || (score !== undefined && score !== '')) {
          courses.push({
            score: score !== undefined ? score : null,
            class_id: classId,
            course_code: subject,
            pupil_id: studentId,
          });
        }
      });

      if (existingScores.length === 0) {
        // If there are no existing scores we need to add them with POST;
        await fetch(`${Url}api/sec-students/student-list/primary-school/class/${grade}/student/${studentId}/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${data.user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(courses),
        });
        console.log('New scores added.');
      } else {
        const updatedScores = existingScores.map(score => ({
          ...score,
          score: dataVal[score.course_code] !== undefined ? dataVal[score.course_code] : null
        }));
        // If we have existing scores then we can edit them with PUT;
        await fetch(`${Url}api/sec-students/student-list/primary-school/class/${grade}/student/${studentId}/`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${data.user.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedScores),
        });
        console.log('Scores updated.');
      }
      // After submiting we navigate to the next tab AKA grade;
      const nextTab = getNextTab(selectedTab);
      if (nextTab) {
        setSelectedPage(nextTab);
      } else {
        setSelectedPage('editStudent');
      }
    } catch (e) {
      console.error('Error submitting grades:', e);
    }
  };

  const handleDeleteGrade = async () => {
    const tabToGradeMap = {
      sixthGrade: '6',
      seventhGrade: '7',
      eightGrade: '8',
      ninthGrade: '9',
    };
    const grade = tabToGradeMap[selectedTab];
    try {
      await fetch(`${Url}api/sec-students/student-list/primary-school/class/${grade}/student/${studentId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${data.user.token}`,
        },
      });
      console.log('Scores deleted.');
      fetchData(grade, studentId);
    } catch (error) {
      console.error('Error deleting scores:', error);
    }
  };

  return <GradeForm onSubmit={handleSubmit} onDelete={handleDeleteGrade} classId={classId} subjects={gradeSubjects} pupilId={studentId} existingScores={existingScores} />;
};

export default GradePage;
