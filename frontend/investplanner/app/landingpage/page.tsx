import Hero from "./hero";
import LandingImage from "./image";
export default function LandingPage(){
    return(
       <div className="bg-gray-200 h-screen flex items-center justify-center overflow-hidden"
       
         style={{
                backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
            }}>
          <Hero />
          <div className="mt-145">
          <LandingImage />

          </div>
       </div>
    )
}