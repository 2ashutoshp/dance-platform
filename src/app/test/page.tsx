"use client";

import { Button } from "@/components/ui/button";
import CameraModel from "@/components/CameraModel";
import { useEffect, useRef, useState } from "react";

export default function Page() {
  const [startAnimation, setStartAnimation] = useState(false);
  const cameraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStartAnimation(true);
        }
      },
      { threshold: 0 }
    );

    if (cameraRef.current) observer.observe(cameraRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen bg-black text-white flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-5xl font-bold">Scroll to Enter the Lens 🚀</h1>
        <Button className="mt-4">Click Me</Button>
        <p className="max-w-md mt-4">
          Your powerful intro copy goes here.
          <br />
          Start scrolling to see the cinematic hyper zoom into the lens.
        </p>
      </section>

      {/* CAMERA SECTION */}
      <section ref={cameraRef} className="relative w-full">
        {startAnimation && <CameraModel />}
      </section>

      {/* POST SECTION */}
      <section className="min-h-screen bg-white text-black flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold">You Have Entered the Lens 🌌</h1>
        <Button className="mt-4">Click Me</Button>
        <p className="max-w-xl mt-4">
          This is your post-lens landing content.
          <br />
          Place your CTAs, services, or storytelling here.
        </p>
      </section>
    </main>
  );
}
