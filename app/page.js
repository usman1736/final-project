"use client";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();
  return (
    <main className="bg-gray-300 h-screen flex flex-col justify-center items-center w-screen">
      <header>
        <h1 className="text-black text-5xl md:text-6xl lg:text-8xl font-extrabold text-center">
          Welcome <br />
          to <br />
          TaskFlow
        </h1>
      </header>
      <div className="flex justify-center gap-5 w-screen mt-40 text text-white">
        <Button
          name={"Sign In"}
          buttonFunction={() => router.push("/sign-in")}
        />
        <Button
          name={"Sign Up"}
          buttonFunction={() => router.push("/sign-up")}
        />
      </div>
    </main>
  );
}

export default Page;
