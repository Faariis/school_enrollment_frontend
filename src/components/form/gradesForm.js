import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

const GradeForm = ({ onSubmit, classId, subjects, pupilId, existingScores }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue, // Destructure setValue from useForm
  } = useForm();

  // Here we are checking if the grade is between 2 and 5 and it must be a number;
  const validateGrade = (value, fieldName) => {
    const grade = parseInt(value);
    // Special validation if the course_code is 'Vjr' because 'Vjr' is an elective subject;
    if (fieldName === 'VJR') {
        if (grade < 2 || grade > 5) return 'Ocjena mora biti između 2 i 5!';
        return true;
    }
    else {
        if (isNaN(grade)) return 'Obavezno polje!';
        if (grade < 2 || grade > 5) return 'Ocjena mora biti između 2 i 5!';
        return true;
    }
  };

  const [focusedInputIndex, setFocusedInputIndex] = useState(0);

  // This function checks the input changes and it switches to the next input field;
  const handleInputChange = (index, value) => {
    setFocusedInputIndex(index);
    const isValidGrade = validateGrade(value, subjects[index]);
    if (isValidGrade !== true) {
      setError(subjects[index], { message: isValidGrade }); // Set error message if grade is invalid
    } else {
      clearErrors(subjects[index]); // Clear error message if grade is valid
      if (index < subjects.length - 1) {
        document.getElementById(subjects[index + 1]).focus(); // Move focus to next input field
      }
    }
  };

  // Effect hook to save grades to local storage
  useEffect(() => {
    subjects.forEach(subject => {
      const savedGrade = localStorage.getItem(`${classId}-${subject}-${pupilId}`);
      if (savedGrade) {
        // If grade exists in local storage, set it in the form
        setValue(subject, savedGrade); // Use setValue to set form values
      }
    });
  }, [classId, subjects, setValue]);

  // Function to save grade to local storage
  const saveGradeToLocalStorage = (fieldName, value) => {
    localStorage.setItem(`${classId}-${fieldName}-${pupilId}`, value);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 bg-opacity-100">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-12 mb-12 w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">Unos predmeta za {classId} razred:</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {subjects.map((subject, index) => (
              <div key={subject} className="flex flex-col mb-4">
                 <div className="flex items-center">
        <label htmlFor={subject} className="text-gray-600 mb-2">
          {subject}
          {errors[subject] && (
            <button
              className="ml-2 text-red-600"
              onClick={() => {
                document.getElementById(subject).focus();
              }}
            >
              *
            </button>
          )}
        </label>
      </div>
      <div className="flex items-center">
                  <input
                    id={subject}
                    className="border border-gray-300 rounded-md py-2 px-4 mb-2 focus:outline-none focus:border-blue-500 flex-grow"
                    type="text"
                    placeholder={`Unesite ocjenu za ${subject}`}
                    {...register(subject, {
                      required: subjects[index] === 'VJR' ? false : true && subjects[index] === '',
                      validate: (value) => validateGrade(value, subjects[index])
                    })}
                    onChange={(e) => {
                      handleInputChange(index, e.target.value);
                      saveGradeToLocalStorage(subjects[index], e.target.value); // Save grade to local storage on change
                    }}
                  />
                </div>
                {errors[subject] && (
                  <p className="text-red-500 italic">{errors[subject]?.message}</p>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <input
              type="submit"
              value="Sačuvaj"
              className="w-full md:w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg"
            />
          </div>
          <div className="flex justify-center items-center">
    {existingScores.length > 0 && (
      <p className="text-red-500 text-xs mb-2">Ocjene su unesene za {classId} razred!</p>
    )}
  </div>
        </form>
      </div>
    </div>
  );
};

export default GradeForm;
