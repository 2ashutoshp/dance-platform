"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";

export default function CameraModel() {
  return (
    <div id="camera-section" className="relative h-[400vh] w-full bg-black">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        className="sticky top-0 h-screen w-screen"
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Model />
      </Canvas>
    </div>
  );
}

function Model() {
  const { scene } = useGLTF("/models/CAMERA.glb");
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("camera-section");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const totalScroll = rect.height - windowHeight;
      const currentScroll = -rect.top;
      let rawProgress = currentScroll / totalScroll;
      rawProgress = Math.min(Math.max(rawProgress, 0), 1);
      setProgress(rawProgress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (!ref.current) return;

    progressRef.current = THREE.MathUtils.lerp(
      progressRef.current,
      progress,
      0.08
    );
    const p = progressRef.current;

    /**
     * PHASES:
     * 0-0.2: appear and start
     * 0.2-0.4: scale up + 180° to screen
     * 0.4-0.65: continue scale + 180° to lens
     * 0.65-0.9: slow hyperzoom
     * 0.9-1: fast hyperzoom
     */

    let rotationY = Math.PI; // initial facing
    let scale = 0.8;
    let camX = 0;
    let camY = 0;

    if (p < 0.2) {
      // appear immediately
      rotationY = Math.PI;
      scale = 0.8;
    } else if (p < 0.4) {
      const t = (p - 0.2) / 0.2;
      rotationY = Math.PI + t * Math.PI;
      scale = 0.8 + t * 0.7;
    } else if (p < 0.65) {
      const t = (p - 0.4) / 0.25;
      rotationY = 2 * Math.PI + t * Math.PI;
      scale = 1.5 + t * 1.5;
    } else if (p < 0.9) {
      const t = (p - 0.65) / 0.25;
      rotationY = 3 * Math.PI;
      scale = 3 + t * 3;
      camX = 0.15; // lens alignment
      camY = -0.1;
    } else {
      const t = (p - 0.9) / 0.1;
      rotationY = 3 * Math.PI;
      scale = 6 + t * 12; // hyperzoom
      camX = 0.15;
      camY = -0.1;
    }

    ref.current.rotation.y = rotationY;
    ref.current.scale.set(scale, scale, scale);
    camera.position.set(camX, camY, 5);
  });

  return <primitive ref={ref} object={scene} />;
}
