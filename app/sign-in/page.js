"use client";
import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function submitForm(e) {
    e.preventDefault();
    console.log(`Email: ${email} Password: ${password}`);
  }

  return (
    <main className="bg-gray-300 h-screen flex flex-col justify-center items-center w-screen">
      <header>
        <h1 className="text-black text-5xl md:text-6xl lg:text-8xl font-extrabold text-center">
          TaskFlow
        </h1>
      </header>
      <form className="flex flex-col justify-center items-center w-screen mt-25">
        <label
          className="text-black text-3xl mb-3 text-left w-[70%] lg:w-[40%]"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className="bg-white rounded-4xl p-4 w-[70%] lg:w-[40%] text-xl text-black mb-3"
          required
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <label
          className="text-black text-3xl mb-3 text-left w-[70%] lg:w-[40%]"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className="bg-white rounded-4xl p-4 w-[70%] lg:w-[40%] text-xl text-black mb-3"
          required
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="flex justify-center gap-5 w-screen mt-10">
          <Button name={"Sign In"} buttonFunction={(e) => submitForm(e)} />
          <Button
            name={"Sign Up"}
            buttonFunction={() => router.push("/sign-up")}
          />
        </div>
      </form>
    </main>
  );
}

export default SignIn;
