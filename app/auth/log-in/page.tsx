"use client";
import { useState, MouseEvent, FormEvent } from "react";
import HideIcon from "@/public/assets/hideViewIcon";
import ShowIcon from "@/public/assets/viewIcon";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";

function Auth() {
  return (
    <div className="w-svh h-svh bg-slate-500 flex flex-row">
      <div className="w-1/2 flex items-center justify-center"></div>

      <div className="w-1/2 flex items-center justify-center bg-white p-3 flex-col gap-y-10">
        <div className="flex justify-start w-[35.5rem]">
          <p className="text-3xl font-semibold"> Sign In</p>
        </div>

        <AuthForm />
      </div>
    </div>
  );
}

export default Auth;

function AuthForm({}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState("");

  const handleHideShowBtn = (event: MouseEvent) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(email, password);

    await axios
      .post(
        "http://127.0.0.1:5000/api/auth/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("refresh_token", res.data.refresh_token);
          router.push("/whiteboard");
        }
        console.log(res.data);
      })
      .catch((err: AxiosError) => {
        const errorMessage = (err.response?.data as { msg: string })?.msg;
        setError(errorMessage);
      });
      
  };

  return (
    <form
      className="flex flex-col gap-y-5 p-2 w-[35.5rem]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-y-3">
        <label htmlFor="email" className="text-gray-400">
          Email address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          className="border-slate-200 border-2 rounded-md py-2 px-3 text-black placeholder:text-black placeholder:font-md "
        />
      </div>
      <div className="flex flex-col gap-y-3">
        <div className="flex justify-between">
          <label htmlFor="password" className="text-gray-400">
            Your password
          </label>
          <button onClick={handleHideShowBtn}>
            {showPassword ? (
              <span className="flex flex-row items-center">
                <ShowIcon /> Show
              </span>
            ) : (
              <span className="flex flex-row items-center">
                <HideIcon /> Hide
              </span>
            )}
          </button>
        </div>

        <input
          type={showPassword ? "password" : "text"}
          name="password"
          id="password"
          className="border-slate-200  border-2 rounded-md py-2 px-3 text-black placeholder:text-black placeholder:font-md "
        />
        <div className="flex justify-end">
          <a href="" className="underline">
            Forget your password
          </a>
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        <button className="bg-gray-400 py-3 px-4 w-80 h-16 rounded-full text-white font-medium text-lg">
          Sign in
        </button>
        <p>
          Don&apos;t have an account?{" "}
          <span>
            <a href="" className="underline font-semibold">
              Sign Up
            </a>
          </span>
        </p>
      </div>
      {error && (
        <div className="bg-[#F69C9C] p-4 rounded-md text-[#0F0A1B] text-lg font-semibold">
          {error}
        </div>
      )}
    </form>
  );
}
