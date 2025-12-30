"use client";
import { gsap } from "gsap";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    gsap.to(".header", { rotation: 360, duration: 2 });
  }, []); // Empty dependency array = run once after mount

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black flex-col gap-4">
      <div className="logo">
        <img src="/logo-white.svg" alt="My Logo" width={30} height={30} />
      </div>
      <div className="content flex flex-col gap-4 items-center">
      <h1 className="border-2 border-sky-500 rounded-md px-2">Fliping Header</h1>
      <h1 className="header">Hi GASP👋🏼</h1>
      </div>

    </div>
  );
}
