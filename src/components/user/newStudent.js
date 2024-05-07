import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Url from "../../../constants";

const NewStudents = ({ setSelectedPage }) => {
  const { data } = useSession();
  const [school, setSchool] = useState(null);
  const [courses, setCourses] = useState(null);

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
      const coursesData = await respCourses.json();
      setCourses(coursesData);
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
      const storeData = {
        primary_school: dataVal.primary_school,
        name: dataVal.name,
        middle_name: dataVal.middle_name,
        last_name: dataVal.last_name,
        gender: dataVal.gender,
        address: dataVal.address,
        guardian_name: dataVal.guardian_name,
        phone_number: dataVal.phone_number,
        guardian_number: dataVal.guardian_number,
        guardian_email: dataVal.guardian_email,
        email: dataVal.email,
        special_case: dataVal.special_case,
        secondary_shool_id: dataVal.school_id,
        desired_course_A: dataVal.course_id,
      };

      const store = await fetch(`${Url}api/sec-students/student-list/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${data.user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });
      setSelectedPage("listStudents");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold mb-3">Dodavanje novog učenika</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {...register("primary_school", { required: "Polje je obavezno!" })}
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
            placeholder="Ukucajte ime učenika"
            {...register("name", { required: "Polje je obavezno!" })}
          />
          {errors.name && (
            <p className="text-red-500 italic">{errors.name?.message}</p>
          )}
          <label
            htmlFor="last_name"
            className="block text-sm font-bold mb-2 mt-4"
          >
            Prezime
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Ukucajte prezime učenika"
            {...register("last_name", { required: "Polje je obavezno!" })}
          />
          {errors.last_name && (
            <p className="text-red-500 italic">{errors.last_name?.message}</p>
          )}
          <label htmlFor="gender" className="block text-sm font-bold mb-2 mt-4">
            Spol
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Unesite spol"
            {...register("gender", { required: "Polje je obavezno!" })}
          />
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
            {...register("address", { required: "Polje je obavezno!" })}
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
            {...register("guardian_name", { required: "Polje je obavezno!" })}
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
            {...register("phone_number", { required: "Polje je obavezno!",
            minLength: { value: 8, message: "Broj telefona mora imati najmanje 8 cifara!" },
            maxLength: { value: 13, message: "Broj telefona može imati najviše 12 cifara!" } })}
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
            {...register("guardian_number", { required: "Polje je obavezno!",
            minLength: { value: 8, message: "Broj telefona mora imati najmanje 8 cifara!" },
            maxLength: { value: 13, message: "Broj telefona može imati najviše 12 cifara!" } })}
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
            placeholder="Unesite email staratelja"
            {...register("guardian_email", { required: "Polje je obavezno!" })}
          />
          {errors.guardian_email && (
            <p className="text-red-500 italic">
              {errors.guardian_email?.message}
            </p>
          )}
          <label htmlFor="email" className="block text-sm font-bold mb-2 mt-4">
            E-mail učenika
          </label>
          <input
            className="border rounded w-full py-2 px-3"
            type="email"
            placeholder="Unesite email učenika"
            {...register("email", { required: "Polje je obavezno!" })}
          />
          {errors.email && (
            <p className="text-red-500 italic">{errors.email?.message}</p>
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
            <option value="invalid">Invaliditet</option>
            <option value="others">Ostali</option>
          </select>
          {errors.special_case && (
            <p className="text-red-500 italic">
              {errors.special_case?.message}
            </p>
          )}

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

          <input
            type="submit"
            value="Prijava"
            className="border rounded w-full py-2 px-3 mt-4 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
};

export default NewStudents;
