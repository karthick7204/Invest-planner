import LoginCard from "./loginCard";

export default function LoginPage() {  
    return (
        <div  style={{
                backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
            }}
            className="bg-gray-100 h-lvh w-full flex flex-col items-center justify-center p-6 rounded-lg shadow-md">
        <h1 className="absolute left-3 top-3 text-black font-bold text-3xl">Spend<span className="text-yellow-400">ly.</span></h1>
        <LoginCard />
        </div>
    )
}