import SignupCard from "./signupCard";

export default function SignupPage() {
    return (
      <div className="bg-gray-200">
     <h1 className="absolute left-3 top-3 text-black font-bold text-3xl">Wealth <span className="text-yellow-400">Pilot.</span></h1>

        <SignupCard />
      </div>
    );
  }