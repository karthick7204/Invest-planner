import Hero from "./hero";
import LandingImage from "./image";
export default function LandingPage() {
  return (
    <div className="bg-gray-200 h-screen flex flex-col md:flex-row items-center justify-start md:justify-center p-6 md:p-0 overflow-hidden"

      style={{
        backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}>
      <Hero />
      <div className="mt-80 ml-125 md:mt-132 md:ml-0 w-[1200px] flex justify-center">
        <LandingImage />
      </div>
    </div>
  )
}