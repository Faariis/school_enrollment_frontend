const SidebarUser = ({ selectedPage, setSelectedPage }) => {
    return (
        <div>
            <div className="flex flex-col">
                <div className="bg-gray-700 text-white py-2 px-4 uppercase border-b text-center font-bold">
                    Učenici
                </div>
                <div
                    onClick={() => setSelectedPage("editStudent")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'editStudent' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <span>Izmijeni učenika</span>
                </div>
                <div
                    onClick={() => setSelectedPage("sixthGrade")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'sixthGrade' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <div>Ocjene 6. razred</div>
                </div>
                <div
                    onClick={() => setSelectedPage("seventhGrade")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'seventhGrade' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <div>Ocjene 7. razred</div>
                </div>
                <div
                    onClick={() => setSelectedPage("eightGrade")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'eightGrade' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <div>Ocjene 8. razred</div>
                </div>
                <div
                    onClick={() => setSelectedPage("ninthGrade")}
                    className={`cursor-pointer border-b hover:bg-gray-100 py-2 px-5 first-letter:capitalize ${selectedPage === 'ninthGrade' ? 'border-r-4 border-r-green-500' : ''}`}>
                    <div>Ocjene 9. razred</div>
                </div>
            </div>
        </div>
    )
};

export default SidebarUser;