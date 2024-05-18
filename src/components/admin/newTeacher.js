import { useForm } from 'react-hook-form';
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import Url from '../../../constants';

const NewTeachers = ({setSelectedPage}) => {
    const { status, data } = useSession();
    const [school, setSchool] = useState(null)
    const [courses, setCourses] = useState(null)

    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    async function getSchool(dataInfo) {
        try {
            const resp = await fetch(`${Url}api/sec-schools/school-list/` + dataInfo.user.school_id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            })
            const schoolData = await resp.json();
            console.log("🚀 ~ file: newTeacher.js:21 ~ getSchool ~ schoolData", schoolData)
            setSchool(schoolData)
            setValue("school_id", schoolData.id)

            const respCourses = await fetch(`${Url}api/sec-schools/school-list/` + dataInfo.user.school_id + '/courses/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${dataInfo.user.token}`
                }
            })
            if (respCourses.status === 401) {
                // Handle token expiration or invalid token
                console.log('Token expired or invalid');
                return;
            }
            const coursesData = await respCourses.json();
            setCourses(coursesData)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (data) {
            getSchool(data)
        }
    }, [data])

    const onSubmit = async (dataVal) => {
        try {
            const storeData = {
                password: dataVal.password,
                is_superuser: false,
                first_name: dataVal.first_name,
                last_name: dataVal.last_name,
                is_staff: false,
                email: dataVal.email,
                school_id: dataVal.school_id,
                course_code: dataVal.course_id
            }

            const store = await fetch(`${Url}api/teachers/teacher-create/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${data.user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(storeData)
            })
            setSelectedPage("listTeachers")
        } catch (e) {
            console.log(e)
        }
    };

    const isValidEmail = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailPattern.test(value);
      };

    return (
        <div>
            <div className="flex flex-col">
                <h1 className="text-2xl font-semibold mb-3">Registracija novog nastavnika</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                {school && (
                        <>
                            <label htmlFor="shool" className="block text-sm font-bold mb-2 mt-4">Škola</label>
                            <div className="relative">
                                <input
                                    className="border rounded w-full py-2 px-3"
                                    type='text'
                                    disabled
                                    value={school.school_name}
                                    {...register('school_id')}
                                />
                            </div>
                        </>
                    )}
                    {courses && (
                        <>
                            <label htmlFor="courses" className="block text-sm font-bold mb-2 mt-4">Smjer</label>
                            <div className="relative">
                                <select
                                    className="border rounded w-full py-2 px-3"
                                    {...register('course_id')}
                                >
                                    {courses.map(item => {
                                        return (
                                            <option
                                                key={item._course_code}
                                                value={item._course_code}>
                                                {item.course_name}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                        </>
                    )}
                    <label htmlFor="first_name" className="block text-sm font-bold mb-2 mt-4">Ime</label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="text"
                        placeholder="Unesite ime nastavnika"
                        maxLength={30}
                        {...register('first_name', { required: "Polje je obavezno!",
                        maxLength: { 
                          value: 30, 
                          message: "Ime može imati maksimalno 30 karaktera." 
                        } })}
                    />
                    {errors.first_name && <p className="text-red-500 italic">{errors.first_name?.message}</p>}
                    <label htmlFor="last_name" className="block text-sm font-bold mb-2 mt-4">Prezime</label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="text"
                        maxLength={30}
                        placeholder="Unesite prezime nastavnika"
                        {...register('last_name', { required: "Polje je obavezno!",
                        maxLength: { 
                          value: 30, 
                          message: "Prezime može imati maksimalno 30 karaktera." 
                        } })}
                    />
                    {errors.last_name && <p className="text-red-500 italic">{errors.last_name?.message}</p>}
                    <label htmlFor="email" className="block text-sm font-bold mb-2 mt-4">E-mail</label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="email"
                        placeholder="Unesite email nastavnika"
                        {...register('email', { 
                            required: "Polje je obavezno!",
                            validate: (value) =>
                                !value || isValidEmail(value) ||
                                "Unesite ispravan e-mail format"
                        })}
                    />
                    {errors.email && <p className="text-red-500 italic">{errors.email?.message}</p>}
                    <label htmlFor="password" className="block text-sm font-bold mb-2 mt-4">Šifra</label>
                    <div className="relative">
                        <input
                            className="border rounded w-full py-2 px-3"
                            type='text'
                            placeholder="Unesite širu nastavnika"
                            {...register('password', { required: "Polje je obavezno!" })}
                        />
                    </div>
                    {errors.password && <p className="text-red-500 italic">{errors.password?.message}</p>}
                    <input type="submit" value="Prijava" className="border rounded w-full py-2 px-3 mt-4 cursor-pointer bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors shadow-lg mr-2" />
                </form>
            </div>
        </div>
    )
};

export default NewTeachers;