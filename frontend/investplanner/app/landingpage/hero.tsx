'use client'
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();
    const login = () => {
        router.push("/auth/login")
    }
    const signup = () => {
        router.push("/auth/signup")
    }
    return (
        <div className="absolute top-45">
            <h1 className="text-black font-bold text-6xl">Wealth <span className="text-yellow-400">Pilot</span></h1>
            <p className="text-gray-600 ml-6 mt-2">Smart way to manage your financial life.</p>

            <div className="mt-4 flex flex-row items-center justify-center gap-4">
                <button className="text-black border-2 border-black bg-[#f6f7f6] px-4 py-2 rounded-2xl cursor-pointer hover:bg-[#e0e0e0]" onClick={login}>
                    Login
                </button>
                <button className="text-black border-2 border-black bg-[#f6f7f6] px-4 py-2 rounded-2xl cursor-pointer hover:bg-[#e0e0e0]" onClick={signup}>
                    Sign Up
                </button>
            </div>
            <div>
            </div>
        </div>
    )
}