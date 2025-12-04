"use client";
import { useState } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "../lib/authHelpers";
import { addUser } from "../lib/controllers";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  async function submitForm(e) {
    e.preventDefault();
    if (!email && !password && !confirmPassword) {
      alert("Fields cannot be empty");
      return;
    }
    if (confirmPassword !== password) {
      alert("Passwords must match");
      return;
    }

    const { user, error } = await signUpWithEmail(email, password);
    if (!error) {
      await addUser(name, email, user.uid);
      router.replace("/home-page");
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
          Name
        </label>
        <input
          className="bg-white rounded-4xl p-4 w-[70%] lg:w-[40%] text-xl text-black mb-3"
          required
          id="email"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
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
        <label
          className="text-black text-3xl mb-3 text-left w-[70%] lg:w-[40%]"
          htmlFor="email"
        >
          Confirm Password
        </label>
        <input
          className="bg-white rounded-4xl p-4 w-[70%] lg:w-[40%] text-xl text-black mb-3"
          required
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
        />
        <div className="flex justify-center gap-5 w-screen mt-10">
          <Button name={"Sign Up"} buttonFunction={(e) => submitForm(e)} />
          <Button name={"Home"} buttonFunction={() => router.push("/")} />
        </div>
      </form>
    </main>
  );
}

export default SignUp;
