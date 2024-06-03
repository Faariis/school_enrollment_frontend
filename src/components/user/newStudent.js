import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";

const NewStudents = ({ setSelectedPage }) => {
  const { data } = useSession();
  const [school, setSchool] = useState(null);
  const [courses, setCourses] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  async function getSchool(dataInfo) {
    try {
      const resp = await fetch(
        `${Url}api/sec-schools/school-list/` + dataInfo.user.school_id,
        {
          method: "GET",
          headers: {
            'Authorization': data ? `Bearer ${data.user.token}` : null
          },
        }
      );
      const schoolData = await resp.json();
      setSchool(schoolData);
      setValue("school_id", schoolData.id);

      const respCourses = await fetch(
        `${Url}api/sec-schools/school-list/${dataInfo.user.school_id}/courses/`,
        {
          method: "GET",
          headers: {
            'Authorization': data ? `Bearer ${data.user.token}` : null
          },
        }
      );
      if (respCourses.status === 401) {
        // Handle token expiration or invalid token
        console.log('Token expired or invalid');
        return;
    }
    const coursesData = await respCourses.json();
    setCourses(coursesData)
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (data) {
      getSchool(data);
    }
  }, [data]);

  const onSubmit = async (dataVal) => {
    try {
      const phoneNumberWithoutSpaces = dataVal.phone_number ? dataVal.phone_number.replace(/\s+/g, "") : "";
      const guardianNumberWithoutSpaces = dataVal.guardian_number ? dataVal.guardian_number.replace(/\s+/g, "") : "";

      const storeData = {
        primary_school: dataVal.primary_school,
        name: dataVal.name,
        middle_name: dataVal.middle_name,
        last_name: dataVal.last_name,
        gender: dataVal.gender,
        address: dataVal.address,
        guardian_name: dataVal.guardian_name,
        phone_number: phoneNumberWithoutSpaces,
        guardian_number: guardianNumberWithoutSpaces,
        guardian_email: dataVal.guardian_email,
        email: dataVal.email,
        special_case: dataVal.special_case,
        secondary_shool_id: dataVal.school_id,
        desired_course_A: dataVal.course_id,
      };

      if (phoneNumberWithoutSpaces && (phoneNumberWithoutSpaces.length < 8 || phoneNumberWithoutSpaces.length > 13)) {
        return;
      }

      if (guardianNumberWithoutSpaces && (guardianNumberWithoutSpaces.length < 8 || guardianNumberWithoutSpaces.length > 13)) {
        return;
      }

      const store = await fetch(`${Url}api/sec-students/student-list/1/student/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });

      if (store.status !== 200)
      {
        setErrorMessage("Došlo je do greške. Pokušajte ponovo.");
      } else {
      setSuccessPopup(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isValidEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailPattern.test(value);
  };

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-3">Dodavanje novog učenika</h1>
        {errorMessage && (
          <p className="text-red-500 italic">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
        {school && (
            <>
              <label
                htmlFor="shool"
                className="block text-sm font-bold mb-2 mt-4"
              >
                Škola
              </label>
              <div className="relative">
                <input
                  className="border rounded w-full py-2 px-3"
                  type="text"
                  disabled
                  value={school.school_name}
                  {...register("school_id")}
                />
              </div>
            </>
          )}
          {courses && (
            <>
              <label
                htmlFor="courses"
                className="block text-sm font-bold mb-2 mt-4"
              >
                Smjer
              </label>
              <div className="relative">
                <select
                  className="border rounded w-full py-2 px-3"
                  {...register("course_id")}
                >
                  {courses.map((item) => {
                    return (
                      <option key={item._course_code} value={item._course_code}>
                        {item.course_name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </>
          )}
          <label
            htmlFor="primary_school"
            className="block text-sm font-bold mb-2 mt-4"
          >
            Osnovna škola
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Unesite osnovnu školu učenika"
            maxLength={50}
            {...register("primary_school", { required: "Polje je obavezno!",
            maxLength: { 
              value: 50, 
              message: "Naziv škole može imati maksimalno 50 karaktera." 
            }})}
          />
          {errors.primary_school && (
            <p className="text-red-500 italic">
              {errors.primary_school?.message}
            </p>
          )}
          <label htmlFor="name" className="block text-sm font-bold mb-2 mt-4">
            Ime
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Unesite ime učenika"
            maxLength={30}
            {...register("name", { required: "Polje je obavezno!",
            maxLength: { 
              value: 30, 
              message: "Ime može imati maksimalno 30 karaktera." 
            }})}
          />
          {errors.name && (
            <p className="text-red-500 italic">{errors.name?.message}</p>
          )}
          <label htmlFor="middle_name" className="block text-sm font-bold mb-2 mt-4">
            Srednje ime
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Unesite srednje ime učenika (nije obavezno)"
            maxLength={30}
            {...register("middle_name", {
              maxLength: { 
                value: 30, 
                message: "Srednje ime može imati maksimalno 30 karaktera." 
              }})}
          />
          <label
            htmlFor="last_name"
            className="block text-sm font-bold mb-2 mt-4"
          >
            Prezime
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Unesite prezime učenika"
            maxLength={50}
            {...register("last_name", { required: "Polje je obavezno!",
            maxLength: { 
              value: 50, 
              message: "Prezime može imati maksimalno 50 karaktera." 
            }})}
          />
          {errors.last_name && (
            <p className="text-red-500 italic">{errors.last_name?.message}</p>
          )}
          <label htmlFor="gender" className="block text-sm font-bold mb-2 mt-4">
            Spol
          </label>
          <select
            className="border rounded w-full py-2 px-3"
            {...register("gender", { required: "Polje je obavezno!" })}
          >
            <option value="M">Muško</option>
            <option value="F">Žensko</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 italic">{errors.gender?.message}</p>
          )}
          <label
            htmlFor="address"
            className="block text-sm font-bold mb-2 mt-4"
          >
            Adresa
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Unesite adresu stanovanja"
            maxLength={60}
            {...register("address", { required: "Polje je obavezno!",
            maxLength: { 
              value: 60, 
              message: "Adresa može imati maksimalno 60 karaktera." 
            }})}
          />
          {errors.address && (
            <p className="text-red-500 italic">{errors.address?.message}</p>
          )}
          <label
            htmlFor="guardian_name"
            className="block text-sm font-bold mb-2 mt-4"
          >
            Ime staratelja
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Unesite ime staratelja"
            maxLength={30}
            {...register("guardian_name", { required: "Polje je obavezno!",
            maxLength: { 
              value: 30, 
              message: "Ime staratelja može imati maksimalno 30 karaktera." 
            }})}
          />
          {errors.guardian_name && (
            <p className="text-red-500 italic">
              {errors.guardian_name?.message}
            </p>
          )}
          <label
            htmlFor="phone_number"
            className="block text-sm font-bold mb-2 mt-4"
          >
            Broj telefona učenika
          </label>
          <input
          className="border rounded w-full py-2 px-3"
          type="text"
          placeholder="Unesite broj telefona učenika"
          defaultValue="+387"
          {...register("phone_number", {
            validate: {
              validNumber: (value) => {
                if (!value) return true; // Skip validation if the field is empty
                const phoneNumberWithoutSpaces = value.replace(/\s+/g, "");
                const isValid = /^\+387\d{6,9}$/.test(phoneNumberWithoutSpaces);
                if (!isValid) {
                  return "Broj telefona mora početi sa +387 i mora biti 9-12 karaktera.";
                }
                return true;
              },
            },
          })}
        />
          {errors.phone_number && (
            <p className="text-red-500 italic">
              {errors.phone_number?.message}
            </p>
          )}
          <label
            htmlFor="guardian_number"
            className="block text-sm font-bold mb-2 mt-4"
          >
            Broj telefona staratelja
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Unesite broj telefona staratelja"
            defaultValue="+387"
            {...register("guardian_number", {
              validate: {
                validNumber: (value) => {
                  if (!value) return true; // Skip validation if the field is empty
                  const phoneNumberWithoutSpaces = value.replace(/\s+/g, "");
                  const isValid = /^\+387\d{6,9}$/.test(phoneNumberWithoutSpaces);
                  if (!isValid) {
                    return "Broj telefona mora početi sa +387 i mora biti 9-12 karaktera.";
                  }
                  return true;
                },
              },
            })}
          />
          {errors.guardian_number && (
            <p className="text-red-500 italic">
              {errors.guardian_number?.message}
            </p>
          )}
          <label
            htmlFor="guardian_email"
            className="block text-sm font-bold mb-2 mt-4"
          >
            E-mail staratelja
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="email"
            placeholder="Unesite email staratelja (nije obavezno)"
            {...register("guardian_email", {
              validate: (value) =>
              !value || isValidEmail(value) ||
                "Unesite ispravan e-mail format",
            })}
          />
          {errors.guardian_email && (
            <p className="text-red-500 italic">{errors.guardian_email.message}</p>
          )}
          <label htmlFor="email" className="block text-sm font-bold mb-2 mt-4">
            E-mail učenika
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="email"
            placeholder="Unesite email učenika (nije obavezno)"
            {...register("email", {
              validate: (value) =>
              !value || isValidEmail(value) ||
                "Unesite ispravan e-mail format",
            })}
          />
          {errors.email && (
            <p className="text-red-500 italic">{errors.email.message}</p>
          )}
          <label
            htmlFor="special_case"
            className="block text-sm font-bold mb-2 mt-4"
          >
            Specijalini kriterij
          </label>
          <select
            className="border rounded w-full py-2 px-3"
            {...register("special_case", { required: "Polje je obavezno!" })}
          >
            <option value="regular">Regular student</option>
            <option value="generation_best_student">Učenik generacije</option>
            <option value="unconditional">Bezuslovni</option>
          </select>
          {errors.special_case && (
            <p className="text-red-500 italic">
              {errors.special_case?.message}
            </p>
          )}
          {successPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-200 bg-opacity-50 backdrop-filter backdrop-blur-sm">
    <div className="bg-white p-8 rounded shadow-lg">
      <p className="font-bold text-green-800 text-lg">Uspješno ste dodali učenika!</p>
      <button
        onClick={() => {
          setSuccessPopup(false);
          setSelectedPage("listStudents");
        }}
        className="ml-20 font-bold mt-4 mx-auto bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded shadow"
      >
        Zatvori
      </button>
    </div>
  </div>
)}
          <input
            type="submit"
            value="Prijava"
            className="border rounded w-full py-2 px-3 mt-4 cursor-pointer bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors shadow-lg mr-2"
          />
        </form>
      </div>
    </div>
  );
};

export default NewStudents;
