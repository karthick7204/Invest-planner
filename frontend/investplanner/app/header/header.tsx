
export default function Header(){
    return(
        <div className="flex p-4 justify-between border-b-2 border-gray-300 ">
            <h1>Invest Planner</h1>
            <div className='border-2 absolute right-20 top-2 border-gray-300 px-4 py-2 cursor-pointer'>
                <div>
                    <h2>Add Transaction</h2>
                </div>
            </div>
            <div className="border-2 absolute top-2 right-4 border-gray-300 h-10 rounded-full px-4 py-2 cursor-pointer">
              
            </div>
        </div>
       
    )
}