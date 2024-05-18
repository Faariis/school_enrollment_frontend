# Next.js frontend routes

This is a description of all the routes used in the frontend.

## API Rute

Ovdje su popisane API rute koje su dostupne u aplikaciji:

### [...nextauth].js
- `${Url}api/teachers/login/`: POST;
- `${Url}api/teachers/teacher/` + user_id + `/`: GET;

## admin

### editTeacher.js
- `${Url}api/teachers/teacher/${teacherId}`: GET;
- `${Url}api/teachers/teacher/${editingTeacher.id}/`: PUT;

### listCourses.js
- `${Url}api/sec-schools/school-list/1/courses/`: GET;

### listTeachers.js
- `${Url}api/teachers/teacher-list/`: GET;
- `${Url}api/teachers/teacher/${id}/`: DELETE;

### newTeacher.js
- `${Url}api/sec-schools/school-list/` + dataInfo.user.school_id: GET (schools);
- `${Url}api/sec-schools/school-list/` + dataInfo.user.school_id + '/courses/': GET (courses);
- `${Url}api/teachers/teacher-create/`: POST;

## user

### editStudent.js
- `${Url}/api/sec-students/student-list/${studentId}`: GET;
- `${Url}/api/sec-students/student-list/${editingStudent.id}/`: PUT;

### gradePage.js
- `${Url}/api/sec-students/student/class_course/`: GET;
- `${Url}/api/sec-students/student-list/${studentId}/course-create/`: POST;

### listStudents.js
- `${Url}api/sec-students/student-list`: GET;
- `${Url}/api/sec-students/student-list/${id}/`: DELETE;

### newStudent.js
- `${Url}api/sec-schools/school-list/` + dataInfo.user.school_id: GET (schools);
- `${Url}api/sec-schools/school-list/` + dataInfo.user.school_id + "/courses/": GET (courses);
- `${Url}/api/sec-students/student-list/`: POST;

### studentAcknowledgments
- `${Url}/api/sec-students/student-list/${studentId}`: GET/POST;

## home

### listCoursesHome.js
- `${Url}api/sec-schools/school-list/1/courses/`: GET;

### listStudentsHome.js
- `${Url}api/sec-students/student-list`: GET;

### listStudentsPerCourse;
- `${Url}api/sec-students/student-list`: GET;

### studentDetails.js
- `${Url}/api/sec-students/student-list/${studentId}/course-create/`: GET;


