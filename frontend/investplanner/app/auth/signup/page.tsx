import SignupCard from "./signupCard";

export default function SignupPage() {
    return (
      <div className="bg-gray-200">
     <h1 className="absolute left-3 top-3 text-black font-bold text-3xl">Spend<span className="text-yellow-400">ly.</span></h1>

        <SignupCard />
      </div>
    );
  }