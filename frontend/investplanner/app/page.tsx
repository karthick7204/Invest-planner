import Image from "next/image";
import Sidebar from "./sidebar/sidebar";
import Dashboard from "./Dashboard/DashBoard";
export default function Home() {
  return (
    <div>
       <Dashboard />
       <Sidebar />
    </div>
  )

}
