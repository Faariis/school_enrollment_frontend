import { useRouter } from 'next/router';

const Sidebar = ({ selectedPage, setSelectedPage }) => {
    const router = useRouter();

    const handlePageChange = (page) => {
        setSelectedPage(page);
        router.push(`/admin/${page}`);
    };

    return (
        <div>
            <div className="flex flex-col">
                <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Nastavnici
                </div>
                <div
                    onClick={() => handlePageChange("listTeachers")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'listTeachers' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Lista nastavnika</span>
                </div>
                <div
                    onClick={() => handlePageChange("newTeacher")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'newTeacher' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <div>Registruj novog nastavnika</div>
                </div>
                <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Učenici
                </div>
                <div
                    onClick={() => handlePageChange("listStudents")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'listStudents' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Lista učenika</span>
                </div>
                <div
                    onClick={() => handlePageChange("newStudent")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'newStudent' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Dodaj novog učenika</span>
                </div>
                <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Smjerovi
                </div>
                <div
                    onClick={() => handlePageChange("listCourses")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'listCourses' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Lista smjerova</span>
                </div>
            </div>
        </div>
    )
};

export default Sidebar;