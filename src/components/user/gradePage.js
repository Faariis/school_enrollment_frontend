import React, { useState, useEffect } from 'react';
import GradeForm from '../form/gradesForm';
import { useSession } from 'next-auth/react';
import Url from '../../../constants';

const GradePage = ({ studentId, setSelectedPage, selectedTab }) => {
  const { data } = useSession();
  const [gradeSubjects, setGradeSubjects] = useState([]);
  const [classId, setClassId] = useState('');
  const [existingScores, setExistingScores] = useState([]);

  // This function is used to check if there are already exisitng scores for class_id, course_code, pupil_id;
  const fetchExistingScores = async () => {
    try {
      const response = await fetch(`${Url}/api/sec-students/student-list/${studentId}/course-create/`, {
        headers: {
          Authorization: `Bearer ${data.user.token}`,
        },
      });
      if (response.ok) {
        const scores = await response.json();
        // Here we filter the existing score based on the grade tab;
        const tabToGradeMap = {
          sixthGrade: 'VI',
          seventhGrade: 'VII',
          eightGrade: 'VIII',
          ninthGrade: 'IX',
        };
        const grade = tabToGradeMap[selectedTab];
        const filteredScores = scores.filter(score => score.class_id === grade);
        setExistingScores(filteredScores);
      } else {
        console.error('Failed to fetch existing scores!');
        setExistingScores([]);
      }
    } catch (error) {
      console.error('Error fetching existing scores:', error);
      setExistingScores([]);
    }
  };

  // This function is used to get the course_code based on the corresponding class_id;
  const fetchCourseCodes = async () => {
    try {
      const response = await fetch(`${Url}/api/sec-students/student/class_course/`);
      if (response.ok) {
        const subjects = await response.json();
        const tabToGradeMap = {
          sixthGrade: 'VI',
          seventhGrade: 'VII',
          eightGrade: 'VIII',
          ninthGrade: 'IX',
        };
        const grade = tabToGradeMap[selectedTab];
        const courseCodes = subjects
          .filter(subject => subject.class_id === grade)
          .map(subject => subject.course_code);
        setGradeSubjects([...new Set(courseCodes)]);
        setClassId(grade);
      } else {
        console.error('Failed to fetch courses!');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchExistingScores();
    fetchCourseCodes();
  }, [selectedTab]);

  const handleSubmit = async (dataVal) => {
    try {
      // Check if existing scores exist for the selected grade
      if (existingScores.length > 0) {
        console.log('Scores already exist.');
        return;
      }

      // Iterate through gradeSubjects to create courses
      const courses = gradeSubjects.map((subject) => ({
        score: dataVal[subject],
        class_id: classId,
        course_code: subject,
        pupil_id: studentId,
      }));

      // Check if the course already exists in the existingScores
      for (const course of courses) {
        const existingScore = existingScores.find(score =>
          score.class_id === course.class_id &&
          score.course_code === course.course_code &&
          score.score === course.score
        );
        if (existingScore) {
          console.log(`Score ${course.score} already exists for course_code ${course.course_code} and class_id ${course.class_id}. Data will not be sent.`);
          return;
        }
      }

      // Main POST function
      if (existingScores.length === 0) {
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
        setSelectedPage('editStudent');
      } else {
        console.log('Existing scores found. Data will not be sent.');
      }
    } catch (e) {
      console.error('Error submitting grades:', e);
    }
  };

  return <GradeForm onSubmit={handleSubmit} classId={classId} subjects={gradeSubjects} pupilId={studentId} existingScores={existingScores} />;
};

export default GradePage;
