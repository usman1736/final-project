"use client";
import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { signinWithEmail } from "../lib/authHelpers";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firebaseError, setFirebaseError] = useState(null);
  const router = useRouter();

  async function submitForm(e) {
    e.preventDefault();
    if (!email && !password) {
      alert("fields cannot be empty");
      return;
    }
    const { user, error } = await signinWithEmail(email, password);
    setFirebaseError(error);
    if (!error) {
      router.replace("/home");
    }
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
        {firebaseError ? (
          <p className="text-red-600 mt-3">invalid credentials. Please try again</p>
        ) : null}
      </form>
    </main>
  );
}

export default SignIn;
