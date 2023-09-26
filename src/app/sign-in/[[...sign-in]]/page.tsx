import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-tl from-gray-700 via-gray-900 to-black">
      <SignIn />
    </div>
  );
}