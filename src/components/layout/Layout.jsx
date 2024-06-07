import { Fragment } from 'react'
import Link from 'next/link'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";
import Head from 'next/head';

const navigation = [
    { name: 'Početna', href: '/', current: true },
    { name: 'User Panel', href: '/user', current: false },
    { name: 'Admin Panel', href: '/admin/listTeachers', current: false },
];

const userNavigation = [
    { name: 'Your Profile', href: '#' },
    { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#' },
]

const userc = {
    name: 'Ismet',
    email: 'i@ismet.ba',
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function Layout({ children }) {
    const { status, data } = useSession();
    const isAdmin = data?.user?.is_superuser;

    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen flex flex-col">
            <Head>
                <title>Upis učenika</title>
            </Head>
            <Disclosure as="nav" className="bg-gray-800">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <img className="h-8 w-8" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {status === "authenticated" && (
                                                <>
                                                    <Link href="/" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                                                        Početna
                                                    </Link>
                                                    {!isAdmin && (
                                                        <Link href="/user" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                                                            Nastavnik opcije
                                                        </Link>
                                                    )}
                                                    {isAdmin && (
                                                        <Link href="/admin/listTeachers" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                                                            Admin opcije
                                                        </Link>
                                                    )}
                                                </>
                                            )}
                                            {status !== "authenticated" && (
                                                <Link href="/" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                                                    Početna
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block ml-auto">
                                    <div className="flex items-center space-x-4">
                                        {status === "authenticated" ? (
                                            <>
                                                <span className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{data?.user?.first_name}{isAdmin ? " (Admin)" : " (Nastavnik)"}</span>
                                                <button onClick={() => signOut()} className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                                    Log out
                                                </button>
                                            </>
                                        ) : (
                                            <div
                                                onClick={() => signIn()}
                                                className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            >
                                                Prijava
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mr-auto flex md:hidden">
                                    <div className="ml-2 flex items-baseline space-x-4">
                                        {status === "authenticated" && (
                                            <>
                                                <Link href="/" className={classNames('text-xs text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                                                    Početna
                                                </Link>
                                                {!isAdmin && (
                                                    <Link href="/user" className={classNames('text-xs text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                                                        Nastavnik opcije
                                                    </Link>
                                                )}
                                                {isAdmin && (
                                                    <Link href="/admin/listTeachers" className={classNames('text-xs text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                                                        Admin opcije
                                                    </Link>
                                                )}
                                                <button onClick={() => signOut()} className="text-xs text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                                    Log out
                                                </button>
                                            </>
                                        )}
                                        {status !== "authenticated" && (
                                            <Link href="/" className={classNames('text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium')}>
                                                Početna
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Disclosure>
            <main className="flex-grow">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            <footer className="bg-gray-800 text-gray-300 py-4">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; {currentYear} Eacon</p>
                </div>
            </footer>
        </div>
    )
}
