const SidebarUser = ({ selectedPage, setSelectedPage }) => {
    return (
        <div>
            <div className="flex flex-col">
                <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Učenici
                </div>
                <div
                    onClick={() => setSelectedPage("listStudents")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'listStudents' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Lista učenika</span>
                </div>
                <div
                    onClick={() => setSelectedPage("newStudent")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'newStudent' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <div>Dodaj novog učenika</div>
                </div>
            </div>
        </div>
    )
};

export default SidebarUser;
