import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import ConfirmationModal from '../delete/confirmationModal';

const GradeForm = ({ onSubmit, onDelete, classId, subjects, pupilId, existingScores, setIsPut }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    setValue,
  } = useForm();
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const showDeleteForm = () => {
    setShowDeleteModal(true);
  }

  const handleDelete = () => {
    subjects.forEach(subject => {
      localStorage.removeItem(`${classId}-${subject}-${pupilId}`);
    });
    subjects.forEach(subject => {
      setValue(subject, '');
    });
    onDelete();
  };

  const handleFormSubmit = async () => {
    if (setIsPut) {
      setShowConfirmationModal(true);
    } else {
      try {
        await handleSubmit(onSubmit)();
      } catch (error) {
        console.error(error);
      }
    }
  };
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
      setError(subjects[index], { message: isValidGrade });
    } else {
      clearErrors(subjects[index]);
      if (index < subjects.length - 1) {
        document.getElementById(subjects[index + 1]).focus();
      }
    }
  };

  // Effect hook to save grades to local storage;
  useEffect(() => {
    subjects.forEach(subject => {
      const savedGrade = localStorage.getItem(`${classId}-${subject}-${pupilId}`);
      if (savedGrade) {
        // If grade exists in local storage, set it in the form;
        setValue(subject, savedGrade);
      }
    });
  
    // Set existing scores in the form fields;
    existingScores.forEach(score => {
      if (score.class_id === classId) {
        setValue(score.course_code, score.score.toString());
      }
    });
  }, [classId, subjects, setValue, existingScores, pupilId]);

  // Function to save grade to local storage;
  const saveGradeToLocalStorage = (fieldName, value) => {
      localStorage.setItem(`${classId}-${fieldName}-${pupilId}`, value);
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 bg-opacity-100">
      <div className="bg-white p-8 rounded-lg shadow-lg mt-12 mb-12 w-full max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-700">Unos predmeta za {classId} razred:</h1>
        <form className="space-y-4">
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
                       }}>*</button>
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
                        type="button"
                        value="Sačuvaj"
                        onClick={handleFormSubmit}
                        className="w-full md:w-40 bg-gray-300 text-gray-700 rounded-md px-4 py-2 hover:bg-gray-400 transition-colors shadow-lg"
                      />
                      {existingScores.length > 0 && (
                      <button
                      type="button"
                      onClick={showDeleteForm}
                      className="ml-2 w-full md:w-40 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 transition-colors shadow-lg">Izbriši</button>
                      )}
                    </div>
                    <div className="flex justify-center items-center">
              {existingScores.length > 0 && (
                <p className="text-red-500 text-xs mb-2">Ocjene su unesene za {classId} razred. Sada ih možete editovati ili izbrisati.</p>
              )}
            </div>
        </form>
        {showDeleteModal && (
        <ConfirmationModal
          message={`Da li ste sigurni da želite izbrisati ocjene za ${classId} razred?`}
          onConfirm={() => {
            handleDelete();
            setShowDeleteModal(false);
          }}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          message={`Da li ste sigurni da želite ažurirati ocjene za ${classId} razred?`}
          onConfirm={() => {
            handleSubmit(onSubmit)();
            setShowConfirmationModal(false);
          }}
          onCancel={() => setShowConfirmationModal(false)}
        />
      )}
      </div>
    </div>
  );
};

export default GradeForm;