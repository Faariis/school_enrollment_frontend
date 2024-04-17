const SidebarHome = ({ selectedPage, setSelectedPage }) => {
    return (
        <div>
            <div className="flex flex-col">
                <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Učenici
                </div>
                <div
                    onClick={() => setSelectedPage("listStudentsHome")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'listStudentsHome' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Lista učenika</span>
                </div>
                <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Smjerovi
                </div>
                <div
                    onClick={() => setSelectedPage("listCoursesHome")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'listCoursesHome' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Lista smjerova</span>
                </div>
            </div>
        </div>
    )
};

export default SidebarHome;

