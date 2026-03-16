export default function Sidebar(){  
    return(
        <div className="w-52 h-screen border-r-2 border-gray-300 p-4">
            <h2 className="text-xl font-bold mb-4">Sidebar</h2> 
            <ul>
                <li className="mb-2 cursor-pointer">Dashboard</li>
                <li className="mb-2 cursor-pointer">Reports</li>
                <li className="mb-2 cursor-pointer">Stock Suggestions</li>
                <div className='absolute bottom-4 '>
                  <li className="mb-2 cursor-pointer">Settings</li>
                  <li className="mb-2 cursor-pointer">Logout</li>


                </div>
            </ul>
        </div>
    )
}   