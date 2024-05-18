import React, { useState } from "react";
import Head from "next/head";
import Link from 'next/link'
import { useForm } from 'react-hook-form';
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation"; 

const Signin = () => {
    const searchParams = useSearchParams();     
    const message = searchParams.get("message");

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const onSubmit = async (data) => {
        try {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            // To bypass the error page when the information is not valid;
            if (!res.error) {
                setSuccessMessage('Prijava uspješna!');
                setErrorMessage(''); // Clear any previous error message
                // If the user exists it routes us to the desired page;
                window.location.href = '/';
            } else {
                // Else we will get an error message;
                setErrorMessage('Pogrešan mail ili šifra!');
            }
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <div>
            <Head>
                <title>Škola</title>
            </Head>
            <div className="container mx-auto px-5 global w-full h-screen flex justify-center items-center ">

                <div className="w-[350px] h-[550px] p-5 border flex flex-col justify-evenly shadow-md ">
                    <h1 className="text-xl font-semibold text-center">Srednja Škola</h1>
                    {message && <p className="text-red-700 bg-red-100 py-2 px-5 rounded-md text-center">{message}</p>}
                    {errorMessage && (<p className="text-white font-bold bg-red-400 py-2 px-5 rounded-md text-center">{errorMessage}</p>)}
                    {successMessage && <p className="text-white font-bold bg-green-400 py-2 px-5 rounded-md text-center">{successMessage}</p>}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="email" className="block text-sm font-bold mb-2 mt-4">Email</label>
                        <input
                            className={`border rounded w-full py-2 px-3 ${errors.email ? 'border-red-500' : ''}`}
                            type="email"
                            placeholder="Email"
                            {...register('email', { required: "Polje je obavezno!" })}
                        />
                        {errors.email && <p className="error">{errors.email?.message}</p>}
                        <label htmlFor="password" className="block text-sm font-bold mb-2 mt-4">Password</label>
                        <div className="relative">
                            <input
                                className={`border rounded w-full py-2 px-3 ${errors.password ? 'border-red-500' : ''}`}
                                type='password'
                                placeholder="Password"
                                {...register('password', { required: "Polje je obavezno!" })}
                            />
                        </div>
                        {errors.password && <p className="error">{errors.password?.message}</p>}
                        <input type="submit" value="Prijava" className="border rounded w-full py-2 px-3 mt-4 cursor-pointer bg-gray-500 hover:bg-gray-400 text-white shadow-md" />
                    </form>
                    <div className="w-full py-2 mt-1 cursor-pointer  text-right">
                        <Link href="/auth/forgot-password">
                            <span className="text-blue-500 underline text-sm ">Zaboravili ste lozinku?</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
