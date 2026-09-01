import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, Terminal, Activity, Layers } from "lucide-react";

export function ThreeHeroScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePreset, setActivePreset] = useState<"crystal" | "torus">("crystal");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Main 3D Object Group
    const mainGroup = new THREE.Group();
    rootGroup.add(mainGroup);

    // Outer wireframe crystal (Icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(3.2, 1);
    const outerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    mainGroup.add(outerMesh);

    // Inner glowing crystal (Octahedron)
    const innerGeo = new THREE.OctahedronGeometry(1.8, 0);
    const innerMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85,
      transmission: 0.3,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // Dual orbital rings
    const ringGeo = new THREE.TorusGeometry(4.4, 0.03, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    mainGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.4,
    });
    const ring2 = new THREE.Mesh(ringGeo, ringMat2);
    ring2.rotation.y = Math.PI / 3.5;
    ring2.rotation.z = Math.PI / 6;
    mainGroup.add(ring2);

    // Orbiting satellite data nodes
    const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const nodeGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
      const m = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (i / 8) * Math.PI * 2;
      m.position.set(Math.cos(angle) * 4.4, Math.sin(angle) * 1.5, Math.sin(angle) * 4.4);
      nodeGroup.add(m);
    }
    mainGroup.add(nodeGroup);

    // Background particle dust
    const pCount = 180;
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.12,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 3.0);
    dirLight1.position.set(6, 8, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x0284c7, 2.0);
    dirLight2.position.set(-6, -6, -5);
    scene.add(dirLight2);

    // Mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2.0;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2.0;
    };
    container.addEventListener("mousemove", onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    let animId: number;
    const clock = new THREE.Clock();

    const loop = () => {
      animId = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();

      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      mainGroup.rotation.y = t * 0.25 + mouseX * 0.75;
      mainGroup.rotation.x = Math.sin(t * 0.3) * 0.15 + mouseY * 0.6;

      outerMesh.rotation.y += 0.004;
      innerMesh.rotation.y -= 0.008;
      ring1.rotation.z += 0.006;
      ring2.rotation.z -= 0.006;
      nodeGroup.rotation.y += 0.01;
      particles.rotation.y = t * 0.03;

      renderer.render(scene, camera);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat1.dispose();
      ringMat2.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activePreset]);

  return (
    <div className="relative w-full h-[460px] rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-950 via-[#0a1120] to-slate-950 p-5 text-white shadow-2xl overflow-hidden flex flex-col justify-between group">
      {/* 3D WebGL Canvas Layer */}
      <div ref={containerRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Overlay Controls & Status */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 rounded-full border border-sky-500/30 bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[11px] font-mono text-sky-300">
          <span className="h-2 w-2 rounded-full bg-sky-400 animate-ping" />
          <span>THREE.JS // 3D_CORE.tsx</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 p-1 text-[10px] backdrop-blur-md font-mono">
          <button
            onClick={() => setActivePreset("crystal")}
            className={`flex items-center gap-1 rounded px-2 py-0.5 transition ${
              activePreset === "crystal" ? "bg-sky-500 text-slate-950 font-bold" : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="h-3 w-3" />
            CRYSTAL
          </button>
        </div>
      </div>

      {/* Floating Center Tech HUD Metrics */}
      <div className="relative z-10 flex flex-col gap-2 pointer-events-none max-w-[210px] self-start mt-auto mb-4">
        <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>CORE VISION</span>
            <Sparkles className="h-3 w-3 text-sky-400" />
          </div>
          <p className="mt-1 text-xs font-semibold text-white leading-tight">
            “能力拔节 · 交付上线 · 高质量就业”
          </p>
        </div>

        <div className="rounded-xl border border-sky-500/20 bg-sky-950/40 p-2.5 backdrop-blur-md flex items-center gap-2.5">
          <Activity className="h-4 w-4 text-sky-400 shrink-0" />
          <div className="text-[11px] leading-tight">
            <span className="text-sky-300 font-bold">26届全员暑期实习</span>
            <p className="text-[10px] text-slate-400">腾讯 / 七牛云 / 微信等直通</p>
          </div>
        </div>
      </div>

      {/* Bottom Footer Info Bar */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-mono text-slate-400 pointer-events-none">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-sky-400" />
          <span>FPS: 60 · INTERACTIVE PARALLAX</span>
        </div>
        <span className="text-sky-400">TOUCH & DRAG TO ROTATE</span>
      </div>
    </div>
  );
}
