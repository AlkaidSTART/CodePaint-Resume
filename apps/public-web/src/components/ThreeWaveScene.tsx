import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ThreeWaveScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 9, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const cols = 36;
    const rows = 36;
    const count = cols * rows;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorSky = new THREE.Color(0x0ea5e9);
    const colorSlate = new THREE.Color(0x94a3b8);

    let i = 0;
    for (let ix = 0; ix < cols; ix++) {
      for (let iz = 0; iz < rows; iz++) {
        const x = (ix - cols / 2) * 0.75;
        const z = (iz - rows / 2) * 0.75;
        positions[i * 3] = x;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = z;

        const dist = Math.sqrt(x * x + z * z);
        const mixedColor = colorSky.clone().lerp(colorSlate, Math.min(dist / 12, 1));
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
        i++;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime() * 1.6;
      const pos = geo.attributes.position.array as Float32Array;

      let idx = 0;
      for (let ix = 0; ix < cols; ix++) {
        for (let iz = 0; iz < rows; iz++) {
          pos[idx * 3 + 1] = Math.sin(ix * 0.35 + t) * 0.7 + Math.cos(iz * 0.35 + t) * 0.7;
          idx++;
        }
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 pointer-events-none opacity-80" />;
}
